# План работ (уточнён)

Ответы приняты:
- Бэкенд — прямо в TanStack Start (`src/routes/api/public/*`), один процесс.
- SMTP — Timeweb: `smtp.timeweb.ru:465`, ящик `info@brandalum.ru`.
- РРЦ = розница. В коде уже есть `RRC_MARKUP = 70%` и `rrcPrice`. Обычный пользователь видит `rrcPrice`, дилер — `totalWithMarkup` (текущая логика).
- Деплой — я готовлю пошаговые команды, вы выполняете по SSH.

---

## Итерация 1 — Меню в шапке и страница «О компании»

- В шапке главной справа от центра меню (3 пункта): **Для дилеров**, **Стать дилером**, **О компании**.
- Шрифт пунктов — Inter 900 uppercase, размер подобран под логотип.
- Текст «Выберите тип конструкции…» переносится под меню.
- Маршрут `/about` — пустая страница с логотипом по центру.
- «О компании» ведёт на `/about`. Две другие пока открывают заглушку-модалку (наполним в след. итерациях).

## Итерация 2 — Дилерский режим (пароль + переключение цен)

- Server route `POST /api/public/dealer-login` — проверяет пароль (`DEALER_PASSWORD`, значение `Qwerty123321!` сохраняем в секрет), ставит httpOnly cookie `dealer=1` на 30 дней (encrypted session, `SESSION_SECRET` генерируется автоматически).
- Server route `POST /api/public/dealer-logout` — сбрасывает cookie.
- Server fn `getDealerMode()` — читает cookie, отдаёт клиенту.
- Пункт «Для дилеров» → модалка с полем «Пароль». При успехе — перезагрузка страницы, режим включён.
- В дилерском режиме в шапке: бейдж «Режим дилера» + «Выйти».
- В карточках главной и в конфигураторе цены переключаются: розница (`rrcPrice`) ↔ дилер (`totalWithMarkup`). Меняется только отображение — расчёты уже готовы.

## Итерация 3 — Модалки заявок + отправка email

- Server route `POST /api/public/contact` — заявка «Обратная связь» (ФИО, телефон, комментарий).
- Server route `POST /api/public/dealer-request` — заявка «Стать дилером» (те же поля).
- Оба отправляют письмо через nodemailer на `artem.br.doors@mail.ru` с `info@brandalum.ru`.
  - SMTP: `smtp.timeweb.ru:465`, secure=true.
  - Секреты: `SMTP_USER` (= `info@brandalum.ru`), `SMTP_PASSWORD` — запрошу через `add_secret` в этой итерации.
- Валидация zod, honeypot-поле против спама, простой rate-limit по IP в памяти.
- Фронт: 
  - В `/configurator/$typeId` под кнопкой «Скачать PDF» — кнопка **«Обратная связь»** → модалка.
  - В меню «Стать дилером» → модалка заявки.
  - Модалки на shadcn `Dialog`, без тяжёлых зависимостей — без лагов.
  - Toast об успехе/ошибке.

## Итерация 4 — Деплой на VPS `brandalum.ru`

Готовлю набор команд для Ubuntu 22/24 VPS:
1. Установка Node 20 + bun + nginx + certbot + pm2.
2. `git clone https://github.com/Xatab4ik13/understand-do.git /var/www/brandalum && cd … && bun install && bun run build`.
3. `.env` с секретами (`DEALER_PASSWORD`, `SESSION_SECRET`, `SMTP_USER`, `SMTP_PASSWORD`).
4. Запуск server bundle через `pm2` на 127.0.0.1:3000.
5. nginx reverse-proxy `brandalum.ru` → `127.0.0.1:3000`, редирект `www` → apex.
6. SSL: `certbot --nginx -d brandalum.ru -d www.brandalum.ru`.
7. Проверка A-записи (уже `104.171.130.12` — ок).
8. Инструкция «как выкатить обновление» (git pull + build + pm2 restart).

---

Стартую с **итерации 1** после вашего «ок».

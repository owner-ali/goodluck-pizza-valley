# API reference
All bodies are JSON. Errors: `{ "message": "plain explanation" }`. Admin routes need `Authorization: Bearer <token>`.

## Public
| Method | Path | Notes |
|---|---|---|
| GET | /api/health | `{ok, db}` |
| GET | /api/menu | `{categories, items}` (available items only) |
| GET | /api/config | `{deliveryFee}` |
| POST | /api/orders | `{customer:{name,phone}, type:'delivery'|'pickup', address, notes, lines:[{itemId,sizeId,addonIds,qty}]}`. Server re-prices from the database. Returns `{orderId,total,status}` |
| POST | /api/orders/track | `{id, phone}` (both must match) |
| POST | /api/reservations | `{name,phone,date:'YYYY-MM-DD',time:'HH:MM',guests,notes}`. Status starts `pending` |
| POST | /api/reservations/track | `{id, phone}` |
| GET | /api/settings | contact, hours, social, about, faqs, deals, deliveryFee |
| GET/POST | /api/reviews | POST creates a `pending` review |
| GET | /api/gallery | photos |
| POST | /api/messages | `{name, contact, message}` |

## Admin (`/api/admin`)
`POST /login {email,password}` returns `{token}` (8 h). Then: `GET /stats`, `GET/PATCH /orders[/:id]`, `GET/PATCH /reservations[/:id]`, `GET /customers`,
`GET/POST/PUT/DELETE /categories[/:id]`, `GET/POST/PUT/DELETE /products[/:id]`, `POST /upload` (multipart field `image`),
`GET/POST/DELETE /gallery`, `GET/PATCH(approve)/DELETE /reviews`, `GET/DELETE /messages`, `GET/PUT /settings`.

Order status: pending, confirmed, preparing, ready, completed, cancelled. Reservation status: pending, approved, rejected, cancelled.

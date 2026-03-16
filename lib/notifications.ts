import nodemailer from 'nodemailer'

interface OrderEmail {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  email: string;
  address: string;
  city?: string | null;
  total: number;
  items?: Array<{ product?: { name: string }; productId: string; weight: string; quantity: number; price: number }>;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendOrderNotification(order: OrderEmail) {
  try {
    if (!ADMIN_EMAIL) {
      console.warn('ADMIN_EMAIL not set — skipping order notification')
      return
    }

    const transporter = getTransporter()
    if (!transporter) {
      console.warn('SMTP not configured — skipping email send')
      return
    }

    const itemsHtml = (order.items || [])
      .map((it) => `<li>${it.product?.name || it.productId} — ${it.weight} × ${it.quantity} — ৳${(it.price * it.quantity).toFixed(2)}</li>`)
      .join('')

    const html = `
      <h2>New Order: ${order.orderNumber}</h2>
      <p><strong>Customer:</strong> ${order.customerName} — ${order.phone} — ${order.email}</p>
      <p><strong>Address:</strong> ${order.address}${order.city ? ', ' + order.city : ''}</p>
      <p><strong>Total:</strong> ৳${order.total}</p>
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
      <p>View in admin panel: /admin/orders</p>
    `

    await transporter.sendMail({
      from: `Order Notifier <${process.env.SMTP_FROM || user}>`,
      to: ADMIN_EMAIL,
      subject: `New order ${order.orderNumber}`,
      html,
    })
  } catch (e) {
    console.error('sendOrderNotification failed', e)
  }
}

export async function sendOrderConfirmationEmail(order: OrderEmail) {
  try {
    const transporter = getTransporter()
    if (!transporter) {
      console.warn('SMTP not configured — skipping customer email')
      return
    }

    const itemsHtml = (order.items || [])
      .map((it) => `<li>${it.product?.name || it.productId} — ${it.weight} × ${it.quantity} — $${(it.price * it.quantity).toFixed(2)}</li>`)
      .join('')

    const html = `
      <h2>Order Confirmed: ${order.orderNumber}</h2>
      <p>Dear ${order.customerName},</p>
      <p>Your order has been confirmed and is being processed.</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li>Order Number: ${order.orderNumber}</li>
        <li>Total: $${order.total.toFixed(2)}</li>
        <li>Status: Confirmed</li>
      </ul>
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
      <p>Thank you for your business!</p>
    `

    await transporter.sendMail({
      from: `Order Confirmation <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: order.email,
      subject: `Order Confirmed: ${order.orderNumber}`,
      html,
    })
  } catch (e) {
    console.error('sendOrderConfirmationEmail failed', e)
  }
}

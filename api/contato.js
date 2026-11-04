export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, telefone, assunto, mensagem } = req.body;

  if (!email || !nome) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
  }

  const payload = {
    email,
    fields: {
      name: nome,
      ...(telefone && { phone: telefone }),
      ...(assunto && { last_name: assunto }), // ajuste o campo conforme seu grupo
    },
    groups: [process.env.MAILERLITE_ID_GROUP],
    ...(mensagem && { note: mensagem }),
  };

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('MailerLite error:', err);
    return res.status(500).json({ error: 'Erro ao registrar contato' });
  }

  return res.status(200).json({ ok: true });
}

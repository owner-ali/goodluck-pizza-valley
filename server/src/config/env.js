const s = process.env.JWT_SECRET || ''
if (s.length < 24 || s.startsWith('change-me')) {
  console.error('Set JWT_SECRET in server/.env to a long random value (24+ characters). Example: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"')
  process.exit(1)
}

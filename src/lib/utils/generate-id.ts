export function generateStudentId(classCode: string): string {
  const year = new Date().getFullYear().toString().slice(-2)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `VSP-${year}-${classCode}-${random}`
}

export function generateStaffId(): string {
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `VSP-STF-${random}`
}

export function generatePassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one of each required character type
  password += 'A' // Uppercase
  password += 'a' // Lowercase
  password += '1' // Number
  password += '!' // Special
  
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

export function generateExamCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CBT-${timestamp}-${random}`
}
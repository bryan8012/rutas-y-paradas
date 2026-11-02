const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const updatedUser = await prisma.user.update({
    where: { email: 'joaquin.zelaya.ext@gmail.com' },
    data: { password: hashedPassword },
  });

  console.log('¡Contraseña actualizada con éxito para:', updatedUser.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
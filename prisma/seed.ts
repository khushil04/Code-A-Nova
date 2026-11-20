import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: 'Social Media', description: 'Social media platform credentials' },
  { name: 'Email', description: 'Email service credentials' },
  { name: 'Banking', description: 'Banking and financial credentials' },
  { name: 'Development', description: 'Developer tools and services' },
  { name: 'Shopping', description: 'Online shopping platform credentials' },
  { name: 'Entertainment', description: 'Streaming and entertainment services' },
  { name: 'Other', description: 'Miscellaneous credentials' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@securevault.com' },
    update: {},
    create: {
      email: 'admin@securevault.com',
      name: 'Admin User',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`  ✓ Admin user created: ${admin.email}`);

  // Create default categories for the admin
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: {
        name_userId: { name: cat.name, userId: admin.id },
      },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
        userId: admin.id,
      },
    });
  }
  console.log(`  ✓ ${DEFAULT_CATEGORIES.length} default categories created`);

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const url = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding...");

  await prisma.$transaction([
    // 1. Admin_user
    prisma.$executeRaw`
      INSERT INTO Admin_user (
        Admin_id, Name, Email, Password_hash, Role, Is_active
      ) VALUES (
        1, 'Zidan Admin', 'admin@example.com',
        '$2b$12$examplehash', 'ADMIN', 'Y'
      )
    `,

    // 2. Organization
    prisma.$executeRaw`
      INSERT INTO Organization (
        Organization_id, Name, Description, Vision,
        Mission, Email, Logo_url
      ) VALUES (
        1,
        'SUKI UMM',
        'Organisasi mahasiswa bidang SUKI',
        'Menjadi organisasi SUKI unggulan',
        'Mengembangkan teknologi SUKI',
        'SUKI@example.com',
        'images/suki01.png'
      )
    `,

    // 3. Category
    prisma.$executeRaw`
      INSERT INTO Category (
        Category_id, Name, Description
      ) VALUES (
        1, 'Suki', 'Informasi seputar suki'
      )
    `,

    // 4. Member_app
    prisma.$executeRaw`
      INSERT INTO Member_app (
        App_id, Full_Name, Email, Phone_Number,
        Submitted_at, Status,
        Organization_Organization_id,
        Admin_user_Admin_id, Admin_user_Email
      ) VALUES (
        1,
        'Budi Santoso',
        'budi@example.com',
        '081234567890',
        '2026-11-09',
        'APPROVED',
        1,
        1,
        'admin@example.com'
      )
    `,

    // 5. Announcement
    prisma.$executeRaw`
      INSERT INTO Announcement (
        Announcement_id, Tittle, Content, Status,
        Created_at, Publish_at,
        Organization_Organization_id,
        Category_Category_id, Category_Name,
        Admin_user_Admin_id, Admin_user_Email
      ) VALUES (
        1,
        'Seminar Suki',
        'Seminar Suki akan dilaksanakan minggu depan.',
        'PUBLISHED',
        '2026-11-09',
        '2026-11-10',
        1,
        1,
        'Suki',
        1,
        'admin@example.com'
      )
    `,

    // 6. Audit_log
    prisma.$executeRaw`
      INSERT INTO Audit_log (
        Audit_id, Action, Entity_type, Entity_id,
        Created_at, Details,
        Admin_user_Admin_id, Admin_user_Email
      ) VALUES (
        1,
        'CREATE',
        'Announcement',
        1,
        '2026-11-09',
        'Admin membuat pengumuman seminar suki',
        1,
        'admin@example.com'
      )
    `,

    // 7. Dapartemen
    prisma.$executeRaw`
      INSERT INTO Dapartemen (
        Departemin_id, Name, Description,
        Contact_email, Organization_Organization_id
      ) VALUES (
        1,
        'Departemen IT',
        'Mengelola suki dan informasi organisasi',
        'it@example.com',
        1
      )
    `,

    // 8. Event
    prisma.$executeRaw`
      INSERT INTO Event (
        Event_id, Tittle, Description, Location,
        Start_at, End_at, Status,
        Organization_Organization_id,
        Admin_user_Admin_id, Admin_user_Email
      ) VALUES (
        1,
        'Workshop Suki',
        'Workshop pengenalan suki dan kitab rongawi',
        'Universitas Muhammadiyah Malang',
        '2026-11-15',
        '2026-11-15',
        'UPCOMING',
        1,
        1,
        'admin@example.com'
      )
    `,

    // 9. Member
    prisma.$executeRaw`
      INSERT INTO Member (
        Member_Id, Member_No, Joined_at, Status,
        Member_app_App_id, Member_app_Email
      ) VALUES (
        1,
        'MEM-001',
        '2026-11-09',
        'ACTIVE',
        1,
        'budi@example.com'
      )
    `,
  ]);

  console.log("Seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
# Cal-me Backend Setup Guide

This guide will help you set up the complete backend for the Cal-me mental health application.

## 🚀 Features Implemented

- **Authentication**: KindeAuth integration for secure user authentication
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe API endpoints
- **Features**:
  - News management
  - Program/Event management with registration
  - Resource management with download tracking
  - Appointment booking system
  - Donation processing
  - Contact form submissions
  - Partner management
  - Testimonial system

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- KindeAuth account

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/calme_db"

# KindeAuth
KINDE_AUTH_DOMAIN="https://your-domain.kinde.com"
KINDE_CLIENT_ID="your-client-id"
KINDE_CLIENT_SECRET="your-client-secret"
KINDE_REDIRECT_URL="http://localhost:3000/api/auth/callback"
KINDE_LOGOUT_REDIRECT_URL="http://localhost:3000"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. KindeAuth Setup

1. Go to [KindeAuth](https://kinde.com) and create an account
2. Create a new application
3. Configure the following URLs:
   - **Redirect URL**: `http://localhost:3000/api/auth/callback`
   - **Logout Redirect URL**: `http://localhost:3000`
4. Copy your domain, client ID, and client secret to the `.env` file

### 3. Database Setup

1. **Create PostgreSQL Database**:
   ```sql
   CREATE DATABASE calme_db;
   ```

2. **Run Database Migrations**:
   ```bash
   npm run db:push
   ```

3. **Seed the Database**:
   ```bash
   npm run db:seed
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm run dev
```

## 📊 Database Schema

The application includes the following main models:

- **User**: User accounts with KindeAuth integration
- **Psychologist**: Mental health professionals
- **NewsItem**: News articles and blog posts
- **Program**: Events and workshops with registration
- **Resource**: Downloadable resources and guides
- **Appointment**: Booking system for consultations
- **Donation**: Donation tracking and processing
- **ContactSubmission**: Contact form submissions
- **Partner**: Organization partners
- **Testimonial**: User testimonials

## 🔧 API Endpoints

All API endpoints are available through tRPC:

### Authentication
- `auth.getCurrentUser` - Get current user info
- `auth.updateProfile` - Update user profile
- `auth.isAdmin` - Check admin status

### News
- `news.getAll` - Get all published news
- `news.getById` - Get single news item
- `news.getLatest` - Get latest news for homepage
- `news.create` - Create news (admin only)
- `news.update` - Update news (admin only)
- `news.delete` - Delete news (admin only)

### Programs
- `programs.getAll` - Get all programs
- `programs.getUpcoming` - Get upcoming programs
- `programs.getById` - Get single program
- `programs.register` - Register for program
- `programs.create` - Create program (admin only)
- `programs.update` - Update program (admin only)
- `programs.delete` - Delete program (admin only)

### Resources
- `resources.getAll` - Get all resources
- `resources.getFeatured` - Get featured resources
- `resources.getById` - Get single resource
- `resources.download` - Download resource
- `resources.create` - Create resource (admin only)
- `resources.update` - Update resource (admin only)
- `resources.delete` - Delete resource (admin only)

### Appointments
- `appointments.getMyAppointments` - Get user's appointments
- `appointments.getPsychologists` - Get available psychologists
- `appointments.getAvailableSlots` - Get available time slots
- `appointments.bookAppointment` - Book appointment
- `appointments.cancelAppointment` - Cancel appointment
- `appointments.updateAppointment` - Update appointment (admin/psychologist)

### Donations
- `donations.createDonation` - Create donation
- `donations.getMyDonations` - Get user's donations
- `donations.getById` - Get donation by ID
- `donations.updateStatus` - Update donation status (admin)
- `donations.getStats` - Get donation statistics (admin)
- `donations.getRecent` - Get recent donations (admin)

### Contact
- `contact.submitContact` - Submit contact form
- `contact.getAll` - Get all submissions (admin)
- `contact.getById` - Get single submission (admin)
- `contact.updateStatus` - Update submission status (admin)
- `contact.getStats` - Get contact statistics (admin)

### Partners
- `partners.getAll` - Get all active partners
- `partners.getById` - Get single partner
- `partners.create` - Create partner (admin only)
- `partners.update` - Update partner (admin only)
- `partners.delete` - Delete partner (admin only)

### Testimonials
- `testimonials.getAll` - Get all approved testimonials
- `testimonials.getById` - Get single testimonial
- `testimonials.submitTestimonial` - Submit testimonial
- `testimonials.getAllForAdmin` - Get all testimonials (admin)
- `testimonials.approve` - Approve testimonial (admin)
- `testimonials.reject` - Reject testimonial (admin)
- `testimonials.update` - Update testimonial (admin)
- `testimonials.delete` - Delete testimonial (admin)

## 🔐 Authentication & Authorization

- **Public Routes**: News, programs, resources, partners, testimonials
- **Protected Routes**: User-specific data (appointments, donations)
- **Admin Routes**: All CRUD operations for content management

## 📝 Usage Examples

### Using tRPC in Components

```tsx
import { api } from "~/trpc/react";

function NewsList() {
  const { data: news, isLoading } = api.news.getAll.useQuery({
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {news?.items.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}
```

### Creating Mutations

```tsx
import { api } from "~/trpc/react";

function ContactForm() {
  const createContact = api.contact.submitContact.useMutation();

  const handleSubmit = (data) => {
    createContact.mutate(data, {
      onSuccess: () => {
        alert("Message sent successfully!");
      },
    });
  };

  // ... form JSX
}
```

## 🚀 Deployment

1. Set up production database
2. Update environment variables for production
3. Run database migrations: `npm run db:migrate`
4. Seed production database: `npm run db:seed`
5. Deploy to your preferred platform (Vercel, Railway, etc.)

## 🔍 Database Management

- **View Database**: `npm run db:studio`
- **Reset Database**: `npm run db:push --force-reset`
- **Generate Prisma Client**: `npm run db:generate`

## 📞 Support

For questions or issues with the backend setup, please refer to the documentation or create an issue in the repository.

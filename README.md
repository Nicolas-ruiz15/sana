# Global sanando desde el ser - Next.js Application

A comprehensive sanando desde el ser platform built with Next.js, TypeScript, and MariaDB, inspired by the Global sanando desde el ser website design.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Database Integration**: Full MariaDB integration with user management
- **Contact System**: Contact form with email notifications
- **Program Management**: Dynamic program listings and details
- **Testimonials**: Customer testimonial system
- **Authentication Ready**: JWT-based authentication system
- **API Routes**: RESTful API endpoints for all functionality

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: MariaDB/MySQL
- **Authentication**: JWT, bcryptjs
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Email**: Nodemailer
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ 
- MariaDB or MySQL database
- SMTP server for email functionality (optional)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your database:**
   - Create a MariaDB/MySQL database
   - Update the database credentials in `.env.local`

3. **Configure environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=global_sanando desde el ser
   
   JWT_SECRET=your-super-secret-jwt-key
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Email configuration (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

4. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application includes the following tables:

- **users**: User accounts and authentication
- **programs**: sanando desde el ser programs and courses
- **blog_posts**: Blog articles and content
- **testimonials**: Customer testimonials
- **contact_submissions**: Contact form submissions
- **newsletter_subscriptions**: Email newsletter subscriptions

## API Endpoints

- `GET /api/programs` - Fetch programs
- `POST /api/programs` - Create new program
- `GET /api/testimonials` - Fetch testimonials
- `POST /api/testimonials` - Create new testimonial
- `POST /api/contact` - Submit contact form

## Pages

- **Home** (`/`) - Landing page with hero, programs, testimonials
- **Programs** (`/programs`) - Program listings with search and filters
- **About** (`/about`) - About page with team and values
- **Contact** (`/contact`) - Contact form and information
- **Blog** (`/blog`) - Blog listings (ready for implementation)

## Customization

### Styling
- Modify `tailwind.config.ts` for custom colors and themes
- Update `app/globals.css` for global styles
- Component styles are in individual component files

### Content
- Update mock data in components for development
- Modify database seed data in `scripts/seed.js`
- Customize email templates in API routes

### Features
- Add new API routes in `app/api/`
- Create new pages in `app/`
- Add new components in `components/`

## Deployment

### Database Setup
1. Set up your production MariaDB/MySQL database
2. Run migrations: `npm run db:migrate`
3. Seed with data: `npm run db:seed`

### Environment Variables
Update your production environment variables:
- Database credentials
- JWT secrets
- SMTP configuration
- Domain URLs

### Build and Deploy
```bash
npm run build
npm start
```

## Admin Features

The application includes an admin user system:
- Default admin: `admin@globalsanando desde el ser.com` / `admin123`
- JWT-based authentication
- Role-based access control ready

## Email Configuration

For contact form functionality:
1. Set up an SMTP server (Gmail, SendGrid, etc.)
2. Update SMTP environment variables
3. Configure email templates in API routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: info@globalsanando desde el ser.com
- Documentation: Check the code comments and README
- Issues: Create a GitHub issue for bugs or feature requests
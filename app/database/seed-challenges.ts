import { prisma } from "./index";

const challenges = [
  {
    title: "Design a Chat application",
    description: `A real-time messaging platform that enables users to communicate instantly with text, images, and files. The application should support both one-on-one conversations and group chats with multiple participants.

**Functional Requirements:**
- User registration and authentication
- Real-time messaging with WebSocket connections
- Message history and persistence
- File and image sharing capabilities
- Group chat creation and management
- Message status indicators (sent, delivered, read)
- User presence indicators (online/offline)
- Message search and filtering
- Push notifications for new messages

**Non-Functional Requirements:**
- Sub-second message delivery latency
- Support for 10,000+ concurrent users
- 99.9% uptime availability
- End-to-end encryption for message security
- Scalable architecture to handle message volume growth
- Mobile-responsive design
- Cross-platform compatibility (web, iOS, Android)`,
    difficulty: "Medium",
    tags: ["Real-time", "WebSocket", "Authentication", "File Sharing", "Notifications"]
  },
  {
    title: "Design a Calendar app",
    description: `A comprehensive scheduling and time management application that helps users organize their personal and professional events, meetings, and tasks.

**Functional Requirements:**
- Event creation, editing, and deletion
- Multiple calendar views (day, week, month, year)
- Recurring event support
- Event reminders and notifications
- Calendar sharing and collaboration
- Integration with external calendar services
- Time zone support
- Event categorization and color coding
- Search and filtering capabilities
- Export/import functionality

**Non-Functional Requirements:**
- Real-time synchronization across devices
- Offline functionality with sync when online
- Fast loading times (<2 seconds)
- Support for multiple time zones
- Secure data encryption
- Scalable to handle millions of events
- Intuitive user interface
- Accessibility compliance`,
    difficulty: "Easy",
    tags: ["Scheduling", "Time Management", "Collaboration", "Notifications", "Integration"]
  },
  {
    title: "Design a Ticket booking system",
    description: `An online platform for booking tickets to events, movies, concerts, and other entertainment venues with real-time seat availability and payment processing.

**Functional Requirements:**
- Event listing and search functionality
- Seat selection with visual seat map
- Real-time availability checking
- Multiple payment methods integration
- Ticket generation and delivery
- User account management
- Booking history and ticket management
- Refund and cancellation policies
- Group booking capabilities
- Mobile ticket support

**Non-Functional Requirements:**
- Handle high traffic during peak booking times
- Real-time seat availability updates
- Secure payment processing (PCI compliance)
- 99.9% uptime during critical booking periods
- Fast response times (<3 seconds)
- Mobile-optimized interface
- Scalable architecture for traffic spikes
- Data backup and recovery systems`,
    difficulty: "Hard",
    tags: ["E-commerce", "Real-time", "Payments", "Inventory", "Mobile"]
  },
  {
    title: "Design a Ride-sharing app",
    description: `A mobile application that connects passengers with drivers for on-demand transportation services, similar to Uber or Lyft.

**Functional Requirements:**
- User registration and driver onboarding
- Real-time location tracking and mapping
- Ride request and matching system
- Dynamic pricing based on demand
- In-app payment processing
- Rating and review system
- Trip history and receipts
- Driver earnings tracking
- Emergency features and safety tools
- Multi-language support

**Non-Functional Requirements:**
- Real-time GPS tracking accuracy
- Sub-second response times for ride requests
- 99.9% uptime availability
- Secure handling of location data
- Scalable to millions of concurrent users
- Mobile-first design
- Offline functionality for basic features
- Compliance with local transportation regulations`,
    difficulty: "Hard",
    tags: ["Real-time", "GPS", "Matching", "Payments", "Mobile", "Safety"]
  },
  {
    title: "Design a Food delivery app",
    description: `A comprehensive platform that connects customers with restaurants for food ordering and delivery services.

**Functional Requirements:**
- Restaurant listing and menu browsing
- Food ordering with customization options
- Real-time order tracking
- Multiple payment methods
- Delivery scheduling and time estimation
- Restaurant and delivery partner management
- Customer reviews and ratings
- Loyalty programs and promotions
- Multi-restaurant ordering
- Dietary preference filtering

**Non-Functional Requirements:**
- Real-time order status updates
- Accurate delivery time predictions
- 99.5% uptime availability
- Fast loading times (<2 seconds)
- Mobile-optimized interface
- Scalable to handle peak ordering times
- Secure payment processing
- Integration with restaurant POS systems`,
    difficulty: "Medium",
    tags: ["E-commerce", "Real-time", "Payments", "Logistics", "Mobile"]
  },
  {
    title: "Design a Video streaming platform",
    description: `A Netflix-like video streaming service that provides on-demand access to movies, TV shows, and original content with adaptive streaming technology.

**Functional Requirements:**
- User registration and subscription management
- Content catalog with search and recommendations
- Adaptive video streaming (multiple quality levels)
- User profiles and watch history
- Content rating and reviews
- Parental controls and content filtering
- Offline download capabilities
- Multi-device synchronization
- Live streaming support
- Content discovery algorithms

**Non-Functional Requirements:**
- Support for 4K and HDR content streaming
- Global CDN for low-latency delivery
- 99.9% uptime availability
- Bandwidth optimization for different connections
- Scalable to millions of concurrent streams
- Cross-platform compatibility
- Content protection and DRM
- Real-time analytics and monitoring`,
    difficulty: "Hard",
    tags: ["Video", "Streaming", "CDN", "Recommendations", "Mobile", "Global"]
  },
  {
    title: "Design a URL shortener",
    description: `A service that converts long URLs into shorter, more manageable links with analytics and customization options.

**Functional Requirements:**
- URL shortening with custom aliases
- Click analytics and tracking
- Link expiration and password protection
- Bulk URL shortening
- API for programmatic access
- Link preview and metadata
- QR code generation
- Link management dashboard
- Custom domain support
- Link sharing and social integration

**Non-Functional Requirements:**
- Sub-millisecond redirect response times
- 99.99% uptime availability
- Handle billions of redirects per day
- Global edge server deployment
- Secure and fast redirect mechanism
- Scalable database architecture
- Real-time analytics processing
- Mobile-optimized interface`,
    difficulty: "Easy",
    tags: ["URL", "Analytics", "API", "Redirect", "Performance"]
  },
  {
    title: "Design a File storage service",
    description: `A cloud-based file storage and synchronization service similar to Dropbox or Google Drive.

**Functional Requirements:**
- File upload, download, and synchronization
- Folder organization and file management
- File sharing with permission controls
- Version history and file recovery
- Real-time collaboration on documents
- File search and filtering
- Mobile app for file access
- API for third-party integrations
- Backup and restore functionality
- Storage quota management

**Non-Functional Requirements:**
- Fast file upload/download speeds
- 99.9% data durability
- End-to-end encryption for file security
- Cross-platform synchronization
- Scalable storage infrastructure
- Real-time conflict resolution
- Bandwidth optimization
- Mobile-optimized interface`,
    difficulty: "Hard",
    tags: ["File Storage", "Sync", "Collaboration", "Security", "Mobile", "API"]
  },
  {
    title: "Design an E-commerce platform",
    description: `A comprehensive online marketplace for buying and selling products with features for merchants, customers, and administrators.

**Functional Requirements:**
- Product catalog with search and filtering
- Shopping cart and checkout process
- User accounts and order management
- Payment processing integration
- Inventory management system
- Order tracking and fulfillment
- Customer reviews and ratings
- Seller dashboard and analytics
- Promotional campaigns and discounts
- Multi-vendor marketplace support

**Non-Functional Requirements:**
- Handle high traffic during peak shopping seasons
- 99.9% uptime availability
- Fast page load times (<3 seconds)
- Secure payment processing (PCI compliance)
- Scalable to millions of products
- Mobile-responsive design
- Real-time inventory updates
- Global shipping and tax calculation`,
    difficulty: "Hard",
    tags: ["E-commerce", "Payments", "Inventory", "Multi-vendor", "Mobile", "Analytics"]
  },
  {
    title: "Design a Social media feed",
    description: `A social networking platform with personalized content feeds, user interactions, and community features.

**Functional Requirements:**
- User profiles and authentication
- Content creation (posts, images, videos)
- Personalized news feed algorithm
- Social interactions (likes, comments, shares)
- User following and follower system
- Content discovery and trending topics
- Privacy settings and content controls
- Real-time notifications
- Content moderation tools
- Analytics and insights dashboard

**Non-Functional Requirements:**
- Real-time feed updates
- Handle millions of posts per day
- 99.9% uptime availability
- Fast content loading (<2 seconds)
- Scalable to billions of users
- Mobile-first responsive design
- Content recommendation algorithms
- Real-time notification delivery`,
    difficulty: "Hard",
    tags: ["Social", "Feed", "Real-time", "Recommendations", "Mobile", "Analytics"]
  },
  {
    title: "Design a Notification system",
    description: `A comprehensive notification service that delivers real-time alerts across multiple channels including email, SMS, push notifications, and in-app messages.

**Functional Requirements:**
- Multi-channel notification delivery
- User preference management
- Notification scheduling and batching
- Template management and customization
- Delivery tracking and analytics
- A/B testing for notification content
- Integration with external services
- Notification history and management
- Real-time delivery status
- Automated notification triggers

**Non-Functional Requirements:**
- Sub-second notification delivery
- 99.99% delivery reliability
- Support for millions of notifications per hour
- Global infrastructure for low latency
- Scalable message queuing system
- Real-time analytics and monitoring
- Mobile push notification optimization
- Email deliverability optimization`,
    difficulty: "Medium",
    tags: ["Notifications", "Real-time", "Multi-channel", "Analytics", "Scalability"]
  },
  {
    title: "Design a Payment gateway",
    description: `A secure payment processing system that handles online transactions, payment methods, and financial data with compliance and fraud detection.

**Functional Requirements:**
- Multiple payment method support (cards, digital wallets, bank transfers)
- Secure payment processing and tokenization
- Fraud detection and risk management
- Payment reconciliation and reporting
- Refund and chargeback handling
- Merchant dashboard and analytics
- API for payment integration
- Webhook notifications for payment events
- Multi-currency support
- Compliance with PCI DSS standards

**Non-Functional Requirements:**
- 99.99% uptime availability
- Sub-second payment processing
- Bank-level security and encryption
- Global payment method support
- Real-time fraud detection
- Scalable to handle peak transaction volumes
- 24/7 monitoring and alerting
- Compliance with financial regulations`,
    difficulty: "Hard",
    tags: ["Payments", "Security", "Compliance", "Fraud Detection", "API", "Global"]
  },
  {
    title: "Design an Online learning platform",
    description: `A comprehensive educational platform that provides courses, assessments, and learning management features for students and instructors.

**Functional Requirements:**
- Course creation and management
- Video streaming and content delivery
- Student enrollment and progress tracking
- Interactive assessments and quizzes
- Discussion forums and collaboration tools
- Certificate generation and verification
- Payment processing for course access
- Instructor dashboard and analytics
- Mobile learning support
- Integration with external learning tools

**Non-Functional Requirements:**
- Support for high-quality video streaming
- 99.9% uptime during peak learning hours
- Scalable to handle thousands of concurrent learners
- Fast content loading and streaming
- Mobile-optimized learning experience
- Secure content protection
- Real-time progress synchronization
- Global content delivery network`,
    difficulty: "Medium",
    tags: ["Education", "Video Streaming", "Assessment", "Collaboration", "Mobile", "Analytics"]
  },
  {
    title: "Design a News aggregator",
    description: `A platform that collects, categorizes, and presents news articles from multiple sources with personalized content recommendations.

**Functional Requirements:**
- News source integration and content aggregation
- Content categorization and tagging
- Personalized news feed based on user preferences
- Search and filtering capabilities
- Real-time news updates
- User bookmarking and reading history
- Social sharing and commenting
- Content recommendation engine
- Breaking news alerts
- Multi-language support

**Non-Functional Requirements:**
- Real-time content updates
- Fast article loading (<2 seconds)
- 99.9% uptime availability
- Scalable to handle millions of articles
- Mobile-optimized reading experience
- Content recommendation accuracy
- Global content delivery
- Real-time analytics and monitoring`,
    difficulty: "Medium",
    tags: ["News", "Aggregation", "Recommendations", "Real-time", "Mobile", "Analytics"]
  },
  {
    title: "Design a Stock trading system",
    description: `A real-time financial trading platform that provides market data, order execution, and portfolio management for individual and institutional investors.

**Functional Requirements:**
- Real-time market data and price feeds
- Order placement and execution
- Portfolio tracking and analytics
- Risk management and position monitoring
- Trading history and reporting
- Market research and analysis tools
- Mobile trading capabilities
- API for algorithmic trading
- Compliance and regulatory reporting
- Multi-market and multi-currency support

**Non-Functional Requirements:**
- Sub-millisecond order execution
- 99.99% uptime during market hours
- Real-time data processing
- High-frequency trading support
- Bank-level security and encryption
- Regulatory compliance
- Scalable to handle market volatility
- 24/7 monitoring and alerting`,
    difficulty: "Hard",
    tags: ["Finance", "Real-time", "Trading", "Security", "Compliance", "Mobile"]
  },
  {
    title: "Design a Real-time multiplayer game backend",
    description: `A backend infrastructure for real-time multiplayer games that handles player connections, game state synchronization, and matchmaking.

**Functional Requirements:**
- Real-time game state synchronization
- Player matchmaking and lobby system
- Game session management
- Player authentication and profiles
- In-game chat and communication
- Leaderboards and achievements
- Anti-cheat and security measures
- Game analytics and telemetry
- Cross-platform play support
- Tournament and competition features

**Non-Functional Requirements:**
- Ultra-low latency (<50ms)
- 99.9% uptime during peak gaming hours
- Support for thousands of concurrent players
- Real-time data synchronization
- Scalable game server architecture
- Global server deployment
- DDoS protection and security
- Real-time monitoring and analytics`,
    difficulty: "Hard",
    tags: ["Gaming", "Real-time", "Multiplayer", "Low Latency", "Scalability", "Security"]
  },
  {
    title: "Design a Music streaming service",
    description: `A Spotify-like music streaming platform that provides access to millions of songs with personalized recommendations and social features.

**Functional Requirements:**
- Music catalog with search and discovery
- Streaming audio with multiple quality options
- Personalized playlists and recommendations
- Social features (sharing, following)
- Offline music download
- User profiles and listening history
- Artist and album information
- Music recommendation algorithms
- Podcast and audio content support
- Integration with smart devices

**Non-Functional Requirements:**
- High-quality audio streaming
- Global CDN for fast music delivery
- 99.9% uptime availability
- Scalable to millions of concurrent streams
- Mobile-optimized interface
- Real-time recommendation updates
- Content protection and licensing
- Cross-platform synchronization`,
    difficulty: "Medium",
    tags: ["Music", "Streaming", "Recommendations", "Social", "Mobile", "CDN"]
  },
  {
    title: "Design a Blog platform",
    description: `A content management system for creating, publishing, and managing blog posts with features for writers, editors, and readers.

**Functional Requirements:**
- Rich text editor for content creation
- Post scheduling and publishing
- Content categorization and tagging
- Comment system and moderation
- User roles and permissions
- SEO optimization tools
- Social media integration
- Analytics and traffic monitoring
- Mobile content management
- Multi-author collaboration

**Non-Functional Requirements:**
- Fast page loading (<3 seconds)
- 99.9% uptime availability
- SEO-optimized content delivery
- Mobile-responsive design
- Scalable content storage
- Real-time comment updates
- Content backup and recovery
- Global content delivery network`,
    difficulty: "Easy",
    tags: ["Content Management", "SEO", "Collaboration", "Analytics", "Mobile", "Social"]
  },
  {
    title: "Design a Search engine",
    description: `A web search engine that indexes and retrieves relevant content from the internet with advanced ranking algorithms and user personalization.

**Functional Requirements:**
- Web crawling and content indexing
- Search query processing and ranking
- Image, video, and news search
- Search suggestions and autocomplete
- Search result personalization
- Advanced search filters
- Search analytics and reporting
- API for programmatic search
- Multi-language search support
- Search result caching

**Non-Functional Requirements:**
- Sub-second search response times
- 99.9% uptime availability
- Handle billions of search queries
- Real-time content indexing
- Scalable search infrastructure
- Global server deployment
- Advanced ranking algorithms
- Mobile-optimized search interface`,
    difficulty: "Hard",
    tags: ["Search", "Indexing", "Ranking", "Personalization", "Scalability", "Global"]
  },
  {
    title: "Design a Content recommendation system",
    description: `An intelligent recommendation engine that suggests relevant content to users based on their behavior, preferences, and similar users.

**Functional Requirements:**
- User behavior tracking and analysis
- Content similarity algorithms
- Collaborative filtering
- Real-time recommendation updates
- A/B testing for recommendation algorithms
- Recommendation explanation and transparency
- Multi-content type support
- User feedback integration
- Recommendation performance analytics
- Privacy-compliant data processing

**Non-Functional Requirements:**
- Real-time recommendation generation
- Sub-second recommendation response
- Scalable to millions of users
- High recommendation accuracy
- Privacy-preserving algorithms
- Mobile-optimized recommendations
- Global recommendation delivery
- Real-time analytics and monitoring`,
    difficulty: "Hard",
    tags: ["Recommendations", "Machine Learning", "Analytics", "Personalization", "Privacy", "Real-time"]
  },
  {
    title: "Design an IoT device management system",
    description: `A platform for managing and monitoring Internet of Things devices with real-time data collection, device control, and analytics.

**Functional Requirements:**
- Device registration and authentication
- Real-time sensor data collection
- Device control and command execution
- Data visualization and dashboards
- Alert and notification system
- Device firmware updates
- Data storage and historical analysis
- API for third-party integrations
- Device grouping and management
- Security and access control

**Non-Functional Requirements:**
- Real-time data processing
- Support for millions of devices
- 99.9% uptime availability
- Low-latency device communication
- Scalable data storage
- Secure device authentication
- Global device connectivity
- Real-time monitoring and alerting`,
    difficulty: "Hard",
    tags: ["IoT", "Real-time", "Device Management", "Data Processing", "Security", "Scalability"]
  },
  {
    title: "Design a Fitness tracking app",
    description: `A comprehensive fitness and health tracking application that monitors physical activity, nutrition, and wellness metrics.

**Functional Requirements:**
- Activity tracking and step counting
- Workout logging and exercise database
- Nutrition tracking and calorie counting
- Health metrics monitoring
- Goal setting and progress tracking
- Social features and challenges
- Wearable device integration
- Data visualization and reports
- Health insights and recommendations
- Integration with health services

**Non-Functional Requirements:**
- Real-time activity tracking
- Accurate sensor data processing
- 99.9% data synchronization
- Mobile-optimized interface
- Battery-efficient operation
- Secure health data storage
- Cross-platform synchronization
- Privacy-compliant data handling`,
    difficulty: "Medium",
    tags: ["Health", "Fitness", "Wearables", "Tracking", "Mobile", "Analytics"]
  },
  {
    title: "Design a Weather data system",
    description: `A comprehensive weather information platform that collects, processes, and delivers accurate weather data and forecasts.

**Functional Requirements:**
- Real-time weather data collection
- Weather forecast generation
- Location-based weather services
- Historical weather data access
- Weather alerts and notifications
- Interactive weather maps
- API for weather data access
- Multi-language support
- Weather data visualization
- Integration with external weather services

**Non-Functional Requirements:**
- Real-time data updates
- Global weather data coverage
- 99.9% uptime availability
- Fast weather data delivery
- Scalable data processing
- Accurate forecast algorithms
- Mobile-optimized interface
- Real-time alert delivery`,
    difficulty: "Medium",
    tags: ["Weather", "Real-time", "Data Processing", "API", "Mobile", "Global"]
  },
  {
    title: "Design an Online polling system",
    description: `A platform for creating, distributing, and analyzing polls and surveys with real-time results and advanced analytics.

**Functional Requirements:**
- Poll creation and customization
- Multiple question types and formats
- Real-time result visualization
- Poll sharing and distribution
- Response collection and validation
- Data export and reporting
- Poll analytics and insights
- User authentication and permissions
- Mobile-optimized polling
- Integration with external platforms

**Non-Functional Requirements:**
- Real-time result updates
- Support for large-scale polls
- 99.9% uptime availability
- Fast poll loading and submission
- Scalable response collection
- Mobile-responsive design
- Data security and privacy
- Real-time analytics processing`,
    difficulty: "Easy",
    tags: ["Polls", "Surveys", "Analytics", "Real-time", "Mobile", "Data"]
  },
  {
    title: "Design a Job board platform",
    description: `A comprehensive job search and recruitment platform that connects job seekers with employers through job postings, applications, and matching algorithms.

**Functional Requirements:**
- Job posting and management
- Job search and filtering
- Resume and profile management
- Application tracking system
- Employer and candidate matching
- Interview scheduling
- Job recommendation algorithms
- Company profiles and reviews
- Salary and compensation data
- Integration with HR systems

**Non-Functional Requirements:**
- Fast job search results
- 99.9% uptime availability
- Scalable to millions of job postings
- Mobile-optimized interface
- Real-time job matching
- Secure candidate data handling
- Global job market coverage
- Real-time application updates`,
    difficulty: "Medium",
    tags: ["Jobs", "Recruitment", "Matching", "Search", "Mobile", "Analytics"]
  },
  {
    title: "Design an Email service",
    description: `A comprehensive email platform that provides email hosting, management, and communication features for individuals and organizations.

**Functional Requirements:**
- Email composition and sending
- Inbox organization and filtering
- Email search and archiving
- Contact management
- Calendar integration
- Email templates and signatures
- Spam and security filtering
- Mobile email access
- Email analytics and reporting
- Integration with other services

**Non-Functional Requirements:**
- Real-time email delivery
- 99.99% uptime availability
- Secure email transmission
- Scalable email storage
- Fast email search
- Mobile-optimized interface
- Global email delivery
- Advanced security features`,
    difficulty: "Hard",
    tags: ["Email", "Communication", "Security", "Mobile", "Storage", "Global"]
  },
  {
    title: "Design an Image hosting service",
    description: `A platform for uploading, storing, and sharing images with features for organization, editing, and distribution.

**Functional Requirements:**
- Image upload and storage
- Image organization and albums
- Image sharing and privacy controls
- Basic image editing tools
- Image search and discovery
- API for image access
- Image optimization and compression
- Gallery and portfolio features
- Image analytics and insights
- Integration with social platforms

**Non-Functional Requirements:**
- Fast image loading and delivery
- 99.9% uptime availability
- Scalable image storage
- Global content delivery network
- Mobile-optimized interface
- Image compression optimization
- Secure image access
- Real-time image processing`,
    difficulty: "Medium",
    tags: ["Images", "Storage", "Sharing", "CDN", "Mobile", "API"]
  },
  {
    title: "Design a Push notification service",
    description: `A comprehensive push notification system that delivers real-time alerts to mobile devices and web browsers across multiple platforms.

**Functional Requirements:**
- Multi-platform push delivery (iOS, Android, Web)
- Notification scheduling and targeting
- User segmentation and personalization
- Notification templates and customization
- Delivery tracking and analytics
- A/B testing for notifications
- Integration with mobile apps
- Web push notifications
- Notification history and management
- Automated notification triggers

**Non-Functional Requirements:**
- Sub-second notification delivery
- 99.99% delivery reliability
- Support for millions of notifications
- Global push infrastructure
- Real-time delivery tracking
- Mobile-optimized notifications
- Scalable message queuing
- Real-time analytics and monitoring`,
    difficulty: "Medium",
    tags: ["Notifications", "Mobile", "Real-time", "Analytics", "Scalability", "Global"]
  },
  {
    title: "Design a Video conferencing platform",
    description: `A comprehensive video communication platform that enables real-time video meetings, webinars, and collaboration with advanced features.

**Functional Requirements:**
- HD video and audio conferencing
- Screen sharing and presentation tools
- Meeting recording and playback
- Chat and messaging during calls
- Meeting scheduling and invitations
- Participant management and controls
- Breakout rooms and collaboration
- Mobile and desktop applications
- Integration with calendar systems
- Meeting analytics and reporting

**Non-Functional Requirements:**
- Low-latency video streaming
- 99.9% uptime during business hours
- Support for thousands of concurrent participants
- Global server infrastructure
- Scalable video processing
- Mobile-optimized experience
- Real-time audio/video synchronization
- Advanced security and encryption`,
    difficulty: "Hard",
    tags: ["Video", "Real-time", "Collaboration", "Low Latency", "Mobile", "Security"]
  },
  {
    title: "Design a Ride dispatch system",
    description: `A backend system for managing ride requests, driver assignments, and real-time coordination between passengers and drivers.

**Functional Requirements:**
- Real-time ride request processing
- Driver matching and assignment algorithms
- Route optimization and navigation
- Real-time location tracking
- Dynamic pricing calculations
- Driver and passenger management
- Trip monitoring and safety features
- Payment processing integration
- Analytics and reporting
- Emergency and safety protocols

**Non-Functional Requirements:**
- Sub-second request processing
- 99.9% uptime availability
- Real-time location accuracy
- Scalable to handle peak demand
- Global server deployment
- Real-time data synchronization
- Advanced security measures
- 24/7 monitoring and support`,
    difficulty: "Hard",
    tags: ["Logistics", "Real-time", "Matching", "GPS", "Scalability", "Safety"]
  },
  {
    title: "Design a URL analytics dashboard",
    description: `A comprehensive analytics platform for tracking and analyzing URL performance, click data, and user behavior across shortened links.

**Functional Requirements:**
- Real-time click tracking and analytics
- Geographic and demographic data
- Referrer and traffic source analysis
- Click timeline and patterns
- Custom analytics dashboards
- Data export and reporting
- A/B testing for link performance
- Alert system for unusual activity
- API for data access
- Integration with marketing tools

**Non-Functional Requirements:**
- Real-time data processing
- 99.9% uptime availability
- Fast analytics queries
- Scalable data storage
- Mobile-optimized dashboards
- Real-time alert delivery
- Global data collection
- Advanced data visualization`,
    difficulty: "Medium",
    tags: ["Analytics", "URLs", "Data Visualization", "Real-time", "Mobile", "API"]
  },
  {
    title: "Design a File sharing and sync system (like Dropbox)",
    description: `A cloud-based file synchronization service that enables users to store, share, and collaborate on files across multiple devices and platforms.

**Functional Requirements:**
- File upload, download, and synchronization
- Real-time file sharing and collaboration
- Version control and file history
- Folder organization and management
- File search and filtering
- Mobile and desktop applications
- API for third-party integrations
- Backup and recovery features
- User permissions and access control
- Integration with productivity tools

**Non-Functional Requirements:**
- Real-time file synchronization
- 99.9% data durability
- Fast file transfer speeds
- Cross-platform compatibility
- Scalable storage infrastructure
- End-to-end encryption
- Mobile-optimized interface
- Global content delivery network`,
    difficulty: "Hard",
    tags: ["File Storage", "Sync", "Collaboration", "Security", "Mobile", "API"]
  },
  {
    title: "Design a QR code generator and tracker",
    description: `A platform for creating, customizing, and tracking QR codes with analytics and management features for businesses and individuals.

**Functional Requirements:**
- QR code generation and customization
- Dynamic QR code creation
- QR code scanning and tracking
- Analytics and performance metrics
- Bulk QR code generation
- QR code management dashboard
- API for programmatic access
- Mobile scanning applications
- Integration with marketing tools
- QR code expiration and management

**Non-Functional Requirements:**
- Fast QR code generation
- 99.9% uptime availability
- Real-time analytics updates
- Mobile-optimized scanning
- Scalable QR code storage
- Global QR code accessibility
- Real-time tracking accuracy
- Advanced analytics processing`,
    difficulty: "Easy",
    tags: ["QR Codes", "Analytics", "Mobile", "API", "Tracking", "Marketing"]
  },
  {
    title: "Design an Expense tracking app",
    description: `A comprehensive personal finance application for tracking expenses, budgeting, and financial planning with categorization and reporting.

**Functional Requirements:**
- Expense logging and categorization
- Budget creation and monitoring
- Receipt scanning and storage
- Financial reporting and analytics
- Bill reminders and notifications
- Investment and savings tracking
- Tax preparation features
- Multi-currency support
- Data export and backup
- Integration with bank accounts

**Non-Functional Requirements:**
- Real-time expense updates
- 99.9% data security
- Fast expense entry and search
- Mobile-optimized interface
- Secure financial data storage
- Cross-platform synchronization
- Offline expense tracking
- Advanced data encryption`,
    difficulty: "Medium",
    tags: ["Finance", "Expenses", "Budgeting", "Mobile", "Security", "Analytics"]
  },
  {
    title: "Design a Real-time dashboard (metrics monitoring)",
    description: `A comprehensive monitoring and analytics dashboard that displays real-time metrics, KPIs, and system performance data for businesses and applications.

**Functional Requirements:**
- Real-time data visualization
- Customizable dashboard widgets
- Alert and notification system
- Historical data analysis
- Multi-source data integration
- User role and permission management
- Dashboard sharing and collaboration
- Mobile and desktop access
- API for data integration
- Automated report generation

**Non-Functional Requirements:**
- Real-time data updates
- Sub-second data refresh rates
- 99.9% uptime availability
- Scalable data processing
- Mobile-responsive design
- Global data collection
- Advanced visualization capabilities
- Real-time alert delivery`,
    difficulty: "Medium",
    tags: ["Dashboard", "Analytics", "Real-time", "Visualization", "Mobile", "Monitoring"]
  },
  {
    title: "Design a Hotel booking system",
    description: `A comprehensive online platform for hotel reservations, room management, and travel planning with real-time availability and pricing.

**Functional Requirements:**
- Hotel and room search functionality
- Real-time availability checking
- Booking and reservation management
- Payment processing integration
- Customer account management
- Hotel management dashboard
- Review and rating system
- Mobile booking application
- Integration with travel services
- Loyalty program management

**Non-Functional Requirements:**
- Real-time availability updates
- 99.9% uptime during peak booking times
- Fast search and booking process
- Mobile-optimized interface
- Scalable to handle booking spikes
- Global hotel coverage
- Secure payment processing
- Real-time price updates`,
    difficulty: "Hard",
    tags: ["Travel", "Booking", "Real-time", "Payments", "Mobile", "Global"]
  },
  {
    title: "Design a Collaborative document editor",
    description: `A real-time collaborative document editing platform similar to Google Docs that enables multiple users to edit documents simultaneously.

**Functional Requirements:**
- Real-time collaborative editing
- Document version control and history
- User presence and cursor tracking
- Comments and suggestions system
- Document sharing and permissions
- Rich text editing capabilities
- Document templates and formatting
- Mobile and desktop applications
- Integration with cloud storage
- Export to multiple formats

**Non-Functional Requirements:**
- Real-time synchronization
- Sub-second editing updates
- 99.9% uptime availability
- Scalable to thousands of concurrent editors
- Cross-platform compatibility
- Mobile-optimized editing
- Advanced conflict resolution
- Real-time collaboration features`,
    difficulty: "Hard",
    tags: ["Collaboration", "Real-time", "Documents", "Mobile", "Version Control", "Synchronization"]
  },
  {
    title: "Design an API rate limiting service",
    description: `A comprehensive API management and rate limiting service that controls access, monitors usage, and protects APIs from abuse and overuse.

**Functional Requirements:**
- Rate limiting and throttling
- API key management and authentication
- Usage monitoring and analytics
- API documentation and testing
- Developer portal and onboarding
- Billing and usage tracking
- API versioning and lifecycle management
- Security and abuse prevention
- Integration with existing APIs
- Real-time monitoring and alerting

**Non-Functional Requirements:**
- Sub-millisecond rate limiting decisions
- 99.99% uptime availability
- Scalable to handle millions of requests
- Real-time usage tracking
- Global API gateway deployment
- Advanced security features
- Real-time analytics processing
- Mobile-optimized developer tools`,
    difficulty: "Medium",
    tags: ["API", "Rate Limiting", "Security", "Analytics", "Scalability", "Developer Tools"]
  },
  {
    title: "Design an Auction platform (like eBay)",
    description: `An online marketplace for auction-style selling and buying with bidding systems, payment processing, and seller management features.

**Functional Requirements:**
- Auction creation and management
- Real-time bidding system
- Payment processing and escrow
- Seller and buyer profiles
- Item listing and categorization
- Search and discovery features
- Rating and review system
- Mobile bidding application
- Integration with shipping services
- Analytics and reporting tools

**Non-Functional Requirements:**
- Real-time bid updates
- 99.9% uptime during auctions
- Scalable to handle bidding spikes
- Secure payment processing
- Mobile-optimized bidding
- Global marketplace support
- Real-time auction monitoring
- Advanced fraud detection`,
    difficulty: "Hard",
    tags: ["E-commerce", "Auctions", "Real-time", "Payments", "Mobile", "Global"]
  },
  {
    title: "Design a Podcast hosting and streaming system",
    description: `A comprehensive platform for podcast creation, hosting, distribution, and streaming with analytics and monetization features.

**Functional Requirements:**
- Podcast upload and hosting
- Audio streaming and playback
- RSS feed generation and management
- Analytics and listener tracking
- Monetization and advertising
- Podcast discovery and search
- Mobile and web applications
- Integration with podcast directories
- Content management tools
- Listener engagement features

**Non-Functional Requirements:**
- High-quality audio streaming
- 99.9% uptime availability
- Global content delivery network
- Scalable audio storage
- Mobile-optimized streaming
- Real-time analytics processing
- Fast podcast discovery
- Cross-platform compatibility`,
    difficulty: "Medium",
    tags: ["Podcasts", "Audio Streaming", "Analytics", "Mobile", "CDN", "Monetization"]
  },
  {
    title: "Design an Online marketplace",
    description: `A comprehensive e-commerce platform that connects buyers and sellers with features for product listing, transactions, and marketplace management.

**Functional Requirements:**
- Product listing and management
- Search and discovery features
- Shopping cart and checkout
- Payment processing and escrow
- Seller dashboard and analytics
- Review and rating system
- Order management and tracking
- Mobile marketplace application
- Integration with shipping services
- Marketplace commission management

**Non-Functional Requirements:**
- Real-time inventory updates
- 99.9% uptime during peak shopping
- Scalable to millions of products
- Fast search and loading times
- Mobile-optimized interface
- Global marketplace support
- Secure payment processing
- Real-time order tracking`,
    difficulty: "Hard",
    tags: ["Marketplace", "E-commerce", "Multi-vendor", "Payments", "Mobile", "Global"]
  },
  {
    title: "Design a Customer support ticket system",
    description: `A comprehensive helpdesk and customer service platform for managing support tickets, customer inquiries, and service level agreements.

**Functional Requirements:**
- Ticket creation and management
- Customer communication tools
- Agent assignment and routing
- Knowledge base and FAQ system
- Ticket prioritization and SLA tracking
- Customer satisfaction surveys
- Integration with CRM systems
- Mobile support application
- Analytics and reporting
- Multi-channel support (email, chat, phone)

**Non-Functional Requirements:**
- Real-time ticket updates
- 99.9% uptime availability
- Fast ticket response times
- Scalable to handle support volume
- Mobile-optimized interface
- Global support coverage
- Real-time notifications
- Advanced analytics processing`,
    difficulty: "Medium",
    tags: ["Support", "Tickets", "CRM", "Analytics", "Mobile", "Real-time"]
  },
  {
    title: "Design a Delivery logistics system",
    description: `A comprehensive logistics platform for managing delivery operations, route optimization, and real-time tracking of shipments and packages.

**Functional Requirements:**
- Delivery order management
- Route optimization and planning
- Real-time tracking and updates
- Driver and vehicle management
- Customer notifications and updates
- Delivery confirmation and proof
- Integration with e-commerce platforms
- Mobile driver applications
- Analytics and performance metrics
- Multi-carrier integration

**Non-Functional Requirements:**
- Real-time tracking accuracy
- 99.9% uptime availability
- Scalable to handle delivery volume
- Mobile-optimized tracking
- Global logistics coverage
- Real-time route optimization
- Advanced analytics processing
- 24/7 monitoring and support`,
    difficulty: "Hard",
    tags: ["Logistics", "Delivery", "Real-time", "Mobile", "Analytics", "Global"]
  },
  {
    title: "Design a Payment split system (like Splitwise)",
    description: `A financial management platform for splitting expenses, managing group payments, and tracking shared costs among friends, roommates, and groups.

**Functional Requirements:**
- Expense splitting and calculation
- Group and individual expense tracking
- Payment reminders and notifications
- Debt settlement and payment processing
- Receipt scanning and storage
- Group management and invitations
- Mobile and web applications
- Integration with payment methods
- Expense categorization and reporting
- Social features and group activities

**Non-Functional Requirements:**
- Real-time expense updates
- 99.9% data accuracy
- Fast expense calculations
- Mobile-optimized interface
- Secure financial data handling
- Cross-platform synchronization
- Real-time notifications
- Advanced expense analytics`,
    difficulty: "Medium",
    tags: ["Finance", "Expenses", "Payments", "Mobile", "Social", "Analytics"]
  },
  {
    title: "Design a Blogging and publishing platform",
    description: `A comprehensive content creation and publishing platform for bloggers, writers, and content creators with monetization and audience engagement features.

**Functional Requirements:**
- Rich text editor and content creation
- Publishing and scheduling tools
- SEO optimization and analytics
- Comment system and moderation
- Social sharing and promotion
- Monetization and subscription features
- Content management and organization
- Mobile content creation
- Integration with social platforms
- Audience analytics and insights

**Non-Functional Requirements:**
- Fast content loading and publishing
- 99.9% uptime availability
- SEO-optimized content delivery
- Mobile-responsive design
- Scalable content storage
- Real-time analytics updates
- Global content delivery
- Advanced content optimization`,
    difficulty: "Medium",
    tags: ["Content", "Blogging", "SEO", "Analytics", "Mobile", "Monetization"]
  },
  {
    title: "Design a Photo sharing social network",
    description: `A social media platform focused on photo sharing, visual content, and community building with features for discovery, engagement, and creativity.

**Functional Requirements:**
- Photo upload and sharing
- Image editing and filters
- Social interactions (likes, comments, follows)
- Photo discovery and trending
- User profiles and galleries
- Privacy controls and content management
- Mobile and web applications
- Integration with camera and photo apps
- Community features and challenges
- Analytics and engagement metrics

**Non-Functional Requirements:**
- Fast photo loading and sharing
- 99.9% uptime availability
- Scalable image storage and delivery
- Mobile-optimized interface
- Global content delivery network
- Real-time social interactions
- Advanced image processing
- Real-time analytics processing`,
    difficulty: "Medium",
    tags: ["Social Media", "Photos", "Mobile", "CDN", "Analytics", "Community"]
  },
  {
    title: "Design a Real-time chat translation system",
    description: `A communication platform that provides real-time translation of chat messages and conversations across multiple languages for global communication.

**Functional Requirements:**
- Real-time message translation
- Multi-language chat support
- Language detection and switching
- Translation accuracy and context
- Chat history and message storage
- User language preferences
- Mobile and web applications
- Integration with existing chat platforms
- Translation quality feedback
- Offline translation capabilities

**Non-Functional Requirements:**
- Sub-second translation response
- 99.9% uptime availability
- Support for 100+ languages
- Real-time translation accuracy
- Mobile-optimized interface
- Global server deployment
- Advanced translation algorithms
- Real-time language processing`,
    difficulty: "Hard",
    tags: ["Translation", "Real-time", "Chat", "Global", "Mobile", "AI"]
  },
  {
    title: "Design an Online code editor",
    description: `A web-based code editor and development environment that enables collaborative coding, real-time editing, and integrated development tools.

**Functional Requirements:**
- Real-time collaborative editing
- Syntax highlighting and code completion
- Multiple programming language support
- File management and project organization
- Integrated terminal and build tools
- Version control and Git integration
- Code sharing and collaboration
- Mobile and desktop access
- Plugin and extension system
- Code execution and testing

**Non-Functional Requirements:**
- Real-time synchronization
- Sub-second editing updates
- 99.9% uptime availability
- Scalable to thousands of concurrent editors
- Cross-platform compatibility
- Mobile-optimized coding
- Advanced code processing
- Real-time collaboration features`,
    difficulty: "Hard",
    tags: ["Code Editor", "Collaboration", "Real-time", "Development", "Mobile", "Version Control"]
  },
  {
    title: "Design a Restaurant reservation system",
    description: `A comprehensive platform for restaurant table reservations, waitlist management, and customer service with real-time availability and booking features.

**Functional Requirements:**
- Table reservation and booking
- Real-time availability checking
- Waitlist management and notifications
- Customer profile and preferences
- Restaurant management dashboard
- Integration with POS systems
- Mobile reservation application
- Customer communication tools
- Analytics and reporting
- Integration with review platforms

**Non-Functional Requirements:**
- Real-time availability updates
- 99.9% uptime during peak hours
- Fast reservation processing
- Mobile-optimized booking
- Scalable to handle booking spikes
- Global restaurant coverage
- Real-time notifications
- Advanced analytics processing`,
    difficulty: "Medium",
    tags: ["Restaurants", "Reservations", "Real-time", "Mobile", "Analytics", "Hospitality"]
  },
  {
    title: "Design a Cryptocurrency exchange platform",
    description: `A comprehensive digital asset trading platform for buying, selling, and managing cryptocurrencies with advanced trading features and security measures.

**Functional Requirements:**
- Cryptocurrency trading and exchange
- Real-time market data and pricing
- Wallet management and security
- Order placement and execution
- Portfolio tracking and analytics
- Mobile and web trading applications
- API for algorithmic trading
- Compliance and regulatory features
- Multi-currency support
- Advanced trading tools and charts

**Non-Functional Requirements:**
- Sub-millisecond order execution
- 99.99% uptime availability
- Real-time market data processing
- Bank-level security and encryption
- Scalable to handle trading volume
- Global market coverage
- Advanced security measures
- 24/7 monitoring and support`,
    difficulty: "Hard",
    tags: ["Cryptocurrency", "Trading", "Real-time", "Security", "Mobile", "Finance"]
  }
];

async function seedChallenges() {
  try {
    console.log("Starting to seed challenges...");
    
    for (const challenge of challenges) {
      await prisma.challenge.create({
        data: challenge
      });
      console.log(`Created challenge: ${challenge.title}`);
    }
    
    console.log("Successfully seeded 50 challenges!");
  } catch (error) {
    console.error("Error seeding challenges:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChallenges();


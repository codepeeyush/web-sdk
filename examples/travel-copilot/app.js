// Enhanced Travel Booking Platform JavaScript - Fixed Version

window.YGC_WIDGET_ID = "YOUR_WIDGET_ID";
(function () {
  var script = document.createElement("script");
  
  script.src = "https://widget.yourgpt.ai/script.js";
  script.id = "yourgpt-chatbot";
  document.body.appendChild(script);

  script.onload = function () {
          console.log("Instnce:",$yourgptChatbot);
          setupChatbotAIActions();

}})();



class TravelBookingApp {
    constructor() {
        this.currentPage = 'home';
        this.searchData = {};
        this.selectedHotel = null;
        this.selectedRoom = null;
        this.bookingData = {};
        
        // Enhanced destinations with high-quality images
        this.destinations = [
            {
                "id": 1,
                "name": "Tokyo",
                "country": "Japan",
                "fullName": "Tokyo, Japan",
                "image": "https://pplx-res.cloudinary.com/image/upload/v1750492827/pplx_project_search_images/ca2df2a14d13cc9a21ae3101ca9df8a82e4cf0bf.jpg",
                "hotels": 189,
                "description": "Modern metropolis blending tradition and innovation with stunning skylines"
            },
            {
                "id": 2,
                "name": "Bali",
                "country": "Indonesia", 
                "fullName": "Bali, Indonesia",
                "image": "https://pplx-res.cloudinary.com/image/upload/v1753866469/pplx_project_search_images/bee4c1ed0081ff233f5b1049e466f7cb67475cac.jpg",
                "hotels": 156,
                "description": "Tropical paradise with pristine beaches and luxury resorts"
            },
            {
                "id": 3,
                "name": "Paris",
                "country": "France",
                "fullName": "Paris, France", 
                "image": "https://pplx-res.cloudinary.com/image/upload/v1753866470/pplx_project_search_images/9a7292d07bed7fe430e8f234b74415049840f12d.jpg",
                "hotels": 245,
                "description": "City of lights and romance with iconic landmarks"
            },
            {
                "id": 4,
                "name": "Dubai",
                "country": "UAE",
                "fullName": "Dubai, UAE",
                "image": "https://pplx-res.cloudinary.com/image/upload/v1752869223/pplx_project_search_images/9c025e14b8c112f826200ab2b939706a25f5ad1f.jpg",
                "hotels": 198,
                "description": "Luxury destination with architectural marvels and modern skyline"
            },
            {
                "id": 5,
                "name": "Maldives",
                "country": "Maldives",
                "fullName": "Maldives",
                "image": "https://pplx-res.cloudinary.com/image/upload/v1753866469/pplx_project_search_images/1f0cda7d4ff9690a744c877c652e55ac8b2c7887.jpg",
                "hotels": 89,
                "description": "Crystal clear waters and exclusive overwater villas"
            },
            {
                "id": 6,
                "name": "New York",
                "country": "USA",
                "fullName": "New York, USA",
                "image": "https://pplx-res.cloudinary.com/image/upload/v1751587531/pplx_project_search_images/435ed15789951edc793830f51a24f25b3aa23260.jpg",
                "hotels": 312,
                "description": "The city that never sleeps with endless possibilities"
            }
        ];
        
        // Enhanced hotels data with better destination matching
        this.hotels = [
            {
                "id": 1,
                "name": "Tokyo Bay Hotel",
                "location": "Tokyo, Japan",
                "stars": 5,
                "rating": 4.8,
                "reviews": 1234,
                "price": 280,
                "image": "https://pplx-res.cloudinary.com/image/upload/v1753866469/pplx_project_search_images/ff2419145ce880a04e85e4c96dc29e7b61ac0cc7.jpg",
                "amenities": ["WiFi", "Pool", "Spa", "Gym", "Restaurant"],
                "roomTypes": ["Deluxe Room", "Executive Suite", "Ocean View Suite"],
                "description": "Luxury hotel with stunning bay views and traditional Japanese hospitality",
                "propertyType": "hotel",
                "rooms": [
                    {"type": "Deluxe Room", "price": 280, "amenities": ["WiFi", "AC", "TV", "City View"], "available": 5},
                    {"type": "Executive Suite", "price": 420, "amenities": ["WiFi", "AC", "TV", "Bay View", "Minibar"], "available": 2},
                    {"type": "Ocean View Suite", "price": 650, "amenities": ["WiFi", "AC", "TV", "Ocean View", "Balcony", "Butler Service"], "available": 1}
                ]
            },
            {
                "id": 2,
                "name": "Bali Beach Resort",
                "location": "Bali, Indonesia",
                "stars": 4,
                "rating": 4.6,
                "reviews": 987,
                "price": 150,
                "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "amenities": ["WiFi", "Pool", "Spa", "Restaurant", "Beach Access"],
                "roomTypes": ["Garden Room", "Ocean Room", "Villa"],
                "description": "Beachfront resort with tropical gardens and world-class spa facilities",
                "propertyType": "resort",
                "rooms": [
                    {"type": "Garden Room", "price": 150, "amenities": ["WiFi", "AC", "Garden View"], "available": 8, "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Ocean Room", "price": 220, "amenities": ["WiFi", "AC", "Ocean View", "Balcony"], "available": 4, "image": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Private Villa", "price": 350, "amenities": ["WiFi", "AC", "Private Pool", "Kitchen"], "available": 2, "image": "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            },
            {
                "id": 3,
                "name": "Grand Palace Hotel",
                "location": "Paris, France",
                "stars": 5,
                "rating": 4.8,
                "reviews": 1234,
                "price": 350,
                "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "amenities": ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Concierge"],
                "roomTypes": ["Standard Room", "Deluxe Suite", "Presidential Suite"],
                "description": "Luxury hotel in the heart of Paris with stunning city views",
                "propertyType": "hotel",
                "rooms": [
                    {"type": "Standard Room", "price": 350, "amenities": ["WiFi", "AC", "TV"], "available": 12, "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Deluxe Suite", "price": 550, "amenities": ["WiFi", "AC", "TV", "City View", "Mini Bar"], "available": 6, "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Presidential Suite", "price": 850, "amenities": ["WiFi", "AC", "TV", "Eiffel Tower View", "Butler Service"], "available": 2, "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            },
            {
                "id": 4,
                "name": "Dubai Luxury Tower",
                "location": "Dubai, UAE",
                "stars": 5,
                "rating": 4.9,
                "reviews": 2341,
                "price": 450,
                "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "amenities": ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Airport Shuttle"],
                "roomTypes": ["Deluxe Room", "Executive Suite", "Penthouse"],
                "description": "Ultra-modern hotel with city skyline views and world-class amenities",
                "propertyType": "hotel",
                "rooms": [
                    {"type": "Deluxe Room", "price": 450, "amenities": ["WiFi", "AC", "TV", "City View"], "available": 15, "image": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Executive Suite", "price": 680, "amenities": ["WiFi", "AC", "TV", "Burj Khalifa View", "Lounge Access"], "available": 5, "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Penthouse", "price": 1200, "amenities": ["WiFi", "AC", "TV", "Panoramic View", "Private Terrace", "Butler Service"], "available": 1, "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            },
            {
                "id": 5,
                "name": "Maldives Water Villa Resort",
                "location": "Maldives",
                "stars": 5,
                "rating": 4.9,
                "reviews": 892,
                "price": 800,
                "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "amenities": ["WiFi", "Spa", "Restaurant", "Water Sports", "Private Beach"],
                "roomTypes": ["Beach Villa", "Water Villa", "Presidential Water Suite"],
                "description": "Exclusive overwater villas in paradise with crystal clear lagoons",
                "propertyType": "resort",
                "rooms": [
                    {"type": "Beach Villa", "price": 800, "amenities": ["WiFi", "AC", "Beach Access", "Private Deck"], "available": 4, "image": "https://images.unsplash.com/photo-1582880421648-a7154d1ccd25?q=80&w=1465&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Water Villa", "price": 1200, "amenities": ["WiFi", "AC", "Overwater", "Glass Floor", "Direct Ocean Access"], "available": 6, "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Presidential Water Suite", "price": 2500, "amenities": ["WiFi", "AC", "Overwater", "Private Pool", "Butler Service", "Yacht Access"], "available": 1, "image": "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            },
            {
                "id": 6,
                "name": "Manhattan Boutique Hotel",
                "location": "New York, USA",
                "stars": 4,
                "rating": 4.5,
                "reviews": 1876,
                "price": 200,
                "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "amenities": ["WiFi", "Gym", "Restaurant", "Business Center"],
                "roomTypes": ["Standard Room", "Junior Suite", "Executive Suite"],
                "description": "Stylish hotel in midtown Manhattan with modern amenities",
                "propertyType": "hotel",
                "rooms": [
                    {"type": "Standard Room", "price": 200, "amenities": ["WiFi", "AC", "TV"], "available": 20, "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Junior Suite", "price": 320, "amenities": ["WiFi", "AC", "TV", "Sitting Area"], "available": 8, "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Executive Suite", "price": 450, "amenities": ["WiFi", "AC", "TV", "City View", "Kitchenette"], "available": 3, "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            },
            {
                "id": 7,
                "name": "Tokyo Garden Hotel",
                "location": "Tokyo, Japan",
                "stars": 4,
                "rating": 4.4,
                "reviews": 756,
                "price": 180,
                "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1494&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "amenities": ["WiFi", "Restaurant", "Garden", "Concierge"],
                "roomTypes": ["Standard Room", "Garden View Room", "Traditional Suite"],
                "description": "Traditional Japanese hospitality in a modern setting with beautiful gardens",
                "propertyType": "hotel",
                "rooms": [
                    {"type": "Standard Room", "price": 180, "amenities": ["WiFi", "AC", "TV"], "available": 10, "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Garden View Room", "price": 240, "amenities": ["WiFi", "AC", "TV", "Garden View"], "available": 6, "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Traditional Suite", "price": 380, "amenities": ["WiFi", "AC", "TV", "Tatami Area", "Tea Service"], "available": 2, "image": "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            },
            {
                "id": 8,
                "name": "Bali Jungle Lodge",
                "location": "Bali, Indonesia",
                "stars": 3,
                "rating": 4.3,
                "reviews": 423,
                "price": 90,
                "image": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "amenities": ["WiFi", "Restaurant", "Nature Tours", "Yoga Studio"],
                "roomTypes": ["Jungle Room", "Treehouse", "Family Villa"],
                "description": "Eco-friendly lodge surrounded by lush tropical forest",
                "propertyType": "villa",
                "rooms": [
                    {"type": "Jungle Room", "price": 90, "amenities": ["WiFi", "Fan", "Nature View"], "available": 8, "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Treehouse", "price": 140, "amenities": ["WiFi", "Fan", "Elevated View", "Balcony"], "available": 4, "image": "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Family Villa", "price": 220, "amenities": ["WiFi", "AC", "Kitchen", "Multiple Bedrooms"], "available": 2, "image": "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            },
            {
                "id": 9,
                "name": "Paris Riverside Hotel",
                "location": "Paris, France",
                "stars": 4,
                "rating": 4.6,
                "reviews": 1234,
                "price": 220,
                "image": "https://cdn.pixabay.com/photo/2016/05/20/19/51/gallery-lafayette-1405830_1280.jpg",
                "amenities": ["WiFi", "Restaurant", "River Views", "Bike Rental"],
                "roomTypes": ["Standard Room", "River View Room", "Junior Suite"],
                "description": "Charming hotel along the Seine River with romantic views",
                "propertyType": "hotel",
                "rooms": [
                    {"type": "Standard Room", "price": 220, "amenities": ["WiFi", "AC", "TV"], "available": 12, "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "River View Room", "price": 290, "amenities": ["WiFi", "AC", "TV", "Seine View"], "available": 8, "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Junior Suite", "price": 420, "amenities": ["WiFi", "AC", "TV", "Seine View", "Balcony"], "available": 3, "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            },
            {
                "id": 10,
                "name": "Dubai Desert Resort",
                "location": "Dubai, UAE",
                "stars": 4,
                "rating": 4.4,
                "reviews": 876,
                "price": 280,
                "image": "https://images.unsplash.com/photo-1539650116574-75c0c6d73c0e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "amenities": ["WiFi", "Pool", "Spa", "Desert Safari", "Restaurant"],
                "roomTypes": ["Desert Room", "Suite with Terrace", "Royal Suite"],
                "description": "Luxury desert experience with modern amenities and safari adventures",
                "propertyType": "resort",
                "rooms": [
                    {"type": "Desert Room", "price": 280, "amenities": ["WiFi", "AC", "TV", "Desert View"], "available": 15, "image": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Suite with Terrace", "price": 420, "amenities": ["WiFi", "AC", "TV", "Private Terrace", "Desert View"], "available": 6, "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
                    {"type": "Royal Suite", "price": 650, "amenities": ["WiFi", "AC", "TV", "Private Pool", "Butler Service"], "available": 2, "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                ]
            }
        ];
        
        



        this.testimonials = [
            {"name": "Sarah Johnson", "rating": 5, "text": "Amazing booking experience! Found the perfect hotel in Paris with incredible views. The process was seamless.", "location": "New York"},
            {"name": "Michael Chen", "rating": 5, "text": "User-friendly interface and excellent customer service. The high-quality images helped me choose the perfect destination!", "location": "San Francisco"},
            {"name": "Emma Wilson", "rating": 4, "text": "Great selection of hotels and easy booking process. Love the detailed search filters. Will definitely use again!", "location": "London"},
            {"name": "James Rodriguez", "rating": 5, "text": "Booked my dream vacation to Maldives through TravelLux. Everything was exactly as shown in the pictures!", "location": "Miami"},
            {"name": "Sophie Martin", "rating": 5, "text": "Outstanding service and beautiful hotel recommendations. The Tokyo trip was unforgettable thanks to TravelLux!", "location": "Toronto"}
        ];
        
        this.amenities = [
            {"id": "wifi", "name": "WiFi", "icon": "📶"},
            {"id": "pool", "name": "Pool", "icon": "🏊"},
            {"id": "spa", "name": "Spa", "icon": "💆"},
            {"id": "gym", "name": "Gym", "icon": "💪"},
            {"id": "restaurant", "name": "Restaurant", "icon": "🍽️"},
            {"id": "parking", "name": "Parking", "icon": "🚗"},
            {"id": "shuttle", "name": "Airport Shuttle", "icon": "🚌"},
            {"id": "beach", "name": "Beach Access", "icon": "🏖️"},
            {"id": "concierge", "name": "Concierge", "icon": "🛎️"},
            {"id": "business", "name": "Business Center", "icon": "💼"}
        ];
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApp();
            });
        } else {
            this.setupApp();
        }
    }
    
    setupApp() {
        this.setupEventListeners();
        this.loadHomepageContent();
        this.setupDateInputs();
        this.loadStoredSearchData();
        console.log('TravelLux app initialized successfully');
    }
    
    setupEventListeners() {
        // Navigation - Fixed to prevent default and handle clicks properly
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const page = e.target.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                } else if (e.target.textContent.trim() === 'Hotels') {
                    this.navigateToPage('search');
                }
            });
        });
        
        // Main search form - Fixed form submission
        const mainSearchForm = document.getElementById('mainSearchForm');
        if (mainSearchForm) {
            mainSearchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleMainSearch();
            });
        }
        
        // Search button - Direct click handler
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleMainSearch();
            });
        }
        
        // Guest selector - Fixed
        this.setupGuestSelector();
        
        // Autocomplete - Fixed
        this.setupAutocomplete();
        
        // Back buttons
        const backToSearchBtn = document.getElementById('backToSearch');
        if (backToSearchBtn) {
            backToSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('search');
            });
        }
        
        const backToHotelBtn = document.getElementById('backToHotel');
        if (backToHotelBtn) {
            backToHotelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('hotel');
            });
        }
        
        // Filters
        this.setupFilters();
        
        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.sortHotels());
        }
        
        // Checkout form
        this.setupCheckoutForm();
        
        // Modal controls
        this.setupModals();
        
        // Mobile menu
        this.setupMobileMenu();
    }
    
    navigateToPage(page) {
        console.log(`Navigating to page: ${page}`);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(`${page}page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.page === page || 
                    (page === 'search' && link.textContent.trim() === 'Hotels') ||
                    (page === 'home' && link.textContent.trim() === 'Home')) {
                    link.classList.add('active');
                }
            });
            
            // Load page-specific content
            switch(page) {
                case 'search':
                    this.loadSearchResults();
                    break;
                case 'hotel':
                    this.loadHotelDetails();
                    break;
                case 'checkout':
                    this.loadCheckoutPage();
                    break;
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.error(`Page not found: ${page}page`);
        }
    }
    
    setupDateInputs() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput) {
            checkinInput.min = today.toISOString().split('T')[0];
            checkinInput.value = today.toISOString().split('T')[0];
        }
        
        if (checkoutInput) {
            checkoutInput.min = tomorrow.toISOString().split('T')[0];
            checkoutInput.value = tomorrow.toISOString().split('T')[0];
        }
        
        // Update checkout min date when checkin changes
        if (checkinInput && checkoutInput) {
            checkinInput.addEventListener('change', () => {
                const checkinDate = new Date(checkinInput.value);
                checkinDate.setDate(checkinDate.getDate() + 1);
                checkoutInput.min = checkinDate.toISOString().split('T')[0];
                
                if (checkoutInput.value <= checkinInput.value) {
                    checkoutInput.value = checkinDate.toISOString().split('T')[0];
                }
            });
        }
    }
    
    setupGuestSelector() {
        const guestsInput = document.getElementById('guests');
        const guestsDropdown = document.querySelector('.guests-dropdown');
        
        if (!guestsInput || !guestsDropdown) return;
        
        // Fixed guest selector click handling
        guestsInput.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            guestsDropdown.classList.toggle('active');
        });
        
        // Counter buttons - Fixed event handling
        document.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const target = e.target.dataset.target;
                const action = e.target.dataset.action;
                const countElement = document.getElementById(`${target}-count`);
                
                if (countElement) {
                    let count = parseInt(countElement.textContent);
                    
                    if (action === 'increase') {
                        count++;
                    } else if (action === 'decrease' && count > 0) {
                        count--;
                        if (target === 'adults' && count < 1) count = 1;
                        if (target === 'rooms' && count < 1) count = 1;
                    }
                    
                    countElement.textContent = count;
                    this.updateGuestsDisplay();
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.guests-selector')) {
                guestsDropdown.classList.remove('active');
            }
        });
        
        this.updateGuestsDisplay();
    }
    
    updateGuestsDisplay() {
        const adultsElement = document.getElementById('adults-count');
        const childrenElement = document.getElementById('children-count');
        const roomsElement = document.getElementById('rooms-count');
        const guestsInput = document.getElementById('guests');
        
        if (!adultsElement || !childrenElement || !roomsElement || !guestsInput) return;
        
        const adults = parseInt(adultsElement.textContent);
        const children = parseInt(childrenElement.textContent);
        const rooms = parseInt(roomsElement.textContent);
        
        let display = `${adults} Adult${adults > 1 ? 's' : ''}`;
        if (children > 0) {
            display += `, ${children} Child${children > 1 ? 'ren' : ''}`;
        }
        display += `, ${rooms} Room${rooms > 1 ? 's' : ''}`;
        
        guestsInput.value = display;
    }
    
    setupAutocomplete() {
        const destinationInput = document.getElementById('destination');
        const dropdown = document.querySelector('.autocomplete-dropdown');
        
        if (!destinationInput || !dropdown) return;
        
        // Fixed autocomplete functionality
        destinationInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length < 2) {
                dropdown.classList.remove('active');
                dropdown.style.display = 'none';
                return;
            }
            
            const matches = this.destinations.filter(dest => 
                dest.name.toLowerCase().includes(query) || 
                dest.country.toLowerCase().includes(query) ||
                dest.fullName.toLowerCase().includes(query)
            );
            
            if (matches.length > 0) {
                dropdown.innerHTML = matches.map(dest => 
                    `<div class="autocomplete-item" data-destination="${dest.fullName}">
                        <strong>${dest.name}</strong>, ${dest.country}
                        <br><small>${dest.hotels} hotels available</small>
                    </div>`
                ).join('');
                
                dropdown.classList.add('active');
                dropdown.style.display = 'block';
                
                // Add click listeners to autocomplete items
                dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        destinationInput.value = item.dataset.destination;
                        dropdown.classList.remove('active');
                        dropdown.style.display = 'none';
                    });
                });
            } else {
                dropdown.classList.remove('active');
                dropdown.style.display = 'none';
            }
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-field')) {
                dropdown.classList.remove('active');
                dropdown.style.display = 'none';
            }
        });
    }
    
    handleMainSearch() {
        const destination = document.getElementById('destination').value;
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const adultsElement = document.getElementById('adults-count');
        const childrenElement = document.getElementById('children-count');
        const roomsElement = document.getElementById('rooms-count');
        
        const adults = adultsElement ? parseInt(adultsElement.textContent) : 2;
        const children = childrenElement ? parseInt(childrenElement.textContent) : 0;
        const rooms = roomsElement ? parseInt(roomsElement.textContent) : 1;
        
        if (!destination || !checkin || !checkout) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        this.searchData = {
            destination,
            checkin,
            checkout,
            adults,
            children,
            rooms
        };
        
        console.log('Search data:', this.searchData);
        
        // Store search data
        localStorage.setItem('travelSearchData', JSON.stringify(this.searchData));
        
        // Navigate to search results
        this.navigateToPage('search');
    }
    
    loadHomepageContent() {
        this.loadDestinations();
        this.loadFeaturedHotels();
        this.loadTestimonials();
    }
    
    loadDestinations() {
        const grid = document.getElementById('destinationsGrid');
        if (!grid) return;
        
        grid.innerHTML = this.destinations.map(dest => `
            <div class="destination-card fade-in-up" data-destination="${dest.fullName}" style="cursor: pointer;">
                <div class="destination-card-image"></div>
                <div class="destination-card-overlay">
                    <h3>${dest.name}</h3>
                    <p>${dest.description}</p>
                    <div class="hotel-count">${dest.hotels} hotels available</div>
                </div>
            </div>
        `).join('');
        
        // Add click listeners - Fixed to work properly
        grid.querySelectorAll('.destination-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const destination = card.dataset.destination;
                const destinationInput = document.getElementById('destination');
                if (destinationInput) {
                    destinationInput.value = destination;
                }
                this.handleMainSearch();
            });
        });
    }
    
    loadFeaturedHotels() {
        const carousel = document.getElementById('featuredHotels');
        if (!carousel) return;
        
        // Show first 4 hotels as featured
        const featuredHotels = this.hotels.slice(0, 4);
        
        carousel.innerHTML = featuredHotels.map(hotel => `
            <div class="hotel-card fade-in-up" data-hotel-id="${hotel.id}" style="cursor: pointer;">
                <div class="hotel-card-image" style="background-image: url('${hotel.image}')"></div>
                <div class="hotel-card-content">
                    <h3>${hotel.name}</h3>
                    <div class="location">${hotel.location}</div>
                    <div class="hotel-rating">
                        <div class="stars">${'★'.repeat(Math.floor(hotel.rating))}${'☆'.repeat(5 - Math.floor(hotel.rating))}</div>
                        <span class="rating-text">${hotel.rating} (${hotel.reviews} reviews)</span>
                    </div>
                    <div class="hotel-price">
                        <span class="price">$${hotel.price}</span>
                        <span class="price-unit">/night</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click listeners - Fixed
        carousel.querySelectorAll('.hotel-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const hotelId = parseInt(card.dataset.hotelId);
                this.selectedHotel = this.hotels.find(h => h.id === hotelId);
                this.navigateToPage('hotel');
            });
        });
    }
    
    loadTestimonials() {
        const carousel = document.getElementById('testimonialsCarousel');
        if (!carousel) return;
        
        carousel.innerHTML = this.testimonials.map(testimonial => `
            <div class="testimonial-card fade-in-up">
                <div class="testimonial-rating">${'★'.repeat(testimonial.rating)}</div>
                <div class="testimonial-text">"${testimonial.text}"</div>
                <div class="testimonial-author">${testimonial.name}</div>
                <div class="testimonial-location">${testimonial.location}</div>
            </div>
        `).join('');
    }
    
    loadSearchResults() {
        const destination = this.searchData.destination || 'Popular Destinations';
        const checkin = this.searchData.checkin || new Date().toISOString().split('T')[0];
        const checkout = this.searchData.checkout || new Date(Date.now() + 86400000).toISOString().split('T')[0];
        
        // Update search header
        const searchTitle = document.getElementById('searchTitle');
        const searchSubtitle = document.getElementById('searchSubtitle');
        
        if (searchTitle) {
            searchTitle.textContent = `Hotels in ${destination.split(',')[0]}`;
        }
        
        // Filter hotels by destination
        const filteredByDestination = this.filterHotelsByDestination(destination);
        
        if (searchSubtitle) {
            searchSubtitle.textContent = 
                `${filteredByDestination.length} hotels found • Check-in: ${this.formatDate(checkin)} • Check-out: ${this.formatDate(checkout)}`;
        }
        
        // Load amenity filters
        this.loadAmenityFilters();
        
        // Load hotel results
        this.displayHotelResults();
        
        // Setup modify search
        const modifySearchBtn = document.getElementById('modifySearch');
        if (modifySearchBtn) {
            modifySearchBtn.addEventListener('click', () => {
                this.navigateToPage('home');
            });
        }
    }
    
    filterHotelsByDestination(destination) {
        if (!destination || destination === 'Popular Destinations') {
            return this.hotels;
        }
        
        // Extract city/country from destination
        const searchLocation = destination.toLowerCase();
        
        return this.hotels.filter(hotel => {
            const hotelLocation = hotel.location.toLowerCase();
            return hotelLocation.includes(searchLocation.split(',')[0]) || 
                   searchLocation.includes(hotelLocation.split(',')[0]);
        });
    }
    
    loadAmenityFilters() {
        const container = document.getElementById('amenityFilters');
        if (!container) return;
        
        container.innerHTML = this.amenities.map(amenity => `
            <label class="filter-checkbox">
                <input type="checkbox" value="${amenity.id}" data-filter="amenity">
                <span class="checkmark"></span>
                <span>${amenity.icon} ${amenity.name}</span>
            </label>
        `).join('');
    }
    
    displayHotelResults() {
        const container = document.getElementById('hotelResults');
        if (!container) return;
        
        // Start with destination-filtered hotels
        let filteredHotels = this.filterHotelsByDestination(this.searchData.destination);
        
        // Apply additional filters
        filteredHotels = this.applyFilters(filteredHotels);
        
        // Sort hotels
        filteredHotels = this.sortHotelsArray(filteredHotels);
        
        // Update results count
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${filteredHotels.length} hotels found`;
        }
        
        container.innerHTML = filteredHotels.map(hotel => `
            <div class="hotel-result-card" data-hotel-id="${hotel.id}" style="cursor: pointer;">
                <div class="hotel-result-image" style="background-image: url('${hotel.image}')"></div>
                <div class="hotel-result-info">
                    <div class="hotel-result-header">
                        <h3>${hotel.name}</h3>
                        <div class="hotel-result-location">${hotel.location}</div>
                        <div class="hotel-rating">
                            <div class="stars">${'★'.repeat(Math.floor(hotel.rating))}${'☆'.repeat(5 - Math.floor(hotel.rating))}</div>
                            <span class="rating-text">${hotel.rating} (${hotel.reviews} reviews)</span>
                        </div>
                    </div>
                    <div class="hotel-result-amenities">
                        ${hotel.amenities.slice(0, 4).map(amenity => 
                            `<span class="amenity-tag">${amenity}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="hotel-result-booking">
                    <div class="hotel-result-price">$${hotel.price}</div>
                    <div class="hotel-result-price-unit">per night</div>
                    <button class="book-now-btn">View Details</button>
                </div>
            </div>
        `).join('');
        
        // Add click listeners - Fixed
        container.querySelectorAll('.hotel-result-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const hotelId = parseInt(card.dataset.hotelId);
                this.selectedHotel = this.hotels.find(h => h.id === hotelId);
                this.navigateToPage('hotel');
            });
        });
    }
    
    applyFilters(hotels) {
        let filtered = [...hotels];
        
        // Price filter
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            const maxPrice = parseInt(priceRange.value);
            filtered = filtered.filter(hotel => hotel.price <= maxPrice);
            const maxPriceDisplay = document.getElementById('maxPrice');
            if (maxPriceDisplay) {
                maxPriceDisplay.textContent = `$${maxPrice}`;
            }
        }
        
        // Rating filters
        const ratingFilters = document.querySelectorAll('input[type="checkbox"][value]:checked');
        const selectedRatings = Array.from(ratingFilters)
            .filter(cb => !cb.dataset.filter)
            .map(cb => parseInt(cb.value));
        
        if (selectedRatings.length > 0) {
            filtered = filtered.filter(hotel => 
                selectedRatings.some(rating => Math.floor(hotel.rating) >= rating)
            );
        }
        
        // Property type filters
        const propertyFilters = document.querySelectorAll('input[data-filter="property"]:checked');
        const selectedProperties = Array.from(propertyFilters).map(cb => cb.value);
        
        if (selectedProperties.length > 0) {
            filtered = filtered.filter(hotel => 
                selectedProperties.includes(hotel.propertyType)
            );
        }
        
        // Amenity filters
        const amenityFilters = document.querySelectorAll('input[data-filter="amenity"]:checked');
        const selectedAmenities = Array.from(amenityFilters).map(cb => cb.value);
        
        if (selectedAmenities.length > 0) {
            const amenityNames = selectedAmenities.map(id => 
                this.amenities.find(a => a.id === id)?.name
            );
            
            filtered = filtered.filter(hotel => 
                amenityNames.some(amenity => 
                    hotel.amenities.some(hotelAmenity => 
                        hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
                    )
                )
            );
        }
        
        return filtered;
    }
    
    sortHotelsArray(hotels) {
        const sortSelect = document.getElementById('sortSelect');
        const sortBy = sortSelect ? sortSelect.value : 'recommended';
        
        switch (sortBy) {
            case 'price-low':
                return hotels.sort((a, b) => a.price - b.price);
            case 'price-high':
                return hotels.sort((a, b) => b.price - a.price);
            case 'rating':
                return hotels.sort((a, b) => b.rating - a.rating);
            case 'distance':
                return hotels.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return hotels.sort((a, b) => b.rating - a.rating);
        }
    }
    
    setupFilters() {
        // Price range slider
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', () => {
                this.displayHotelResults();
            });
        }
        
        // Filter checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('.filters-sidebar')) {
                this.displayHotelResults();
            }
        });
        
        // Clear filters
        const clearFiltersBtn = document.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                });
                if (priceRange) priceRange.value = 500;
                this.displayHotelResults();
            });
        }
    }
    
    sortHotels() {
        this.displayHotelResults();
    }
    
    loadHotelDetails() {
        if (!this.selectedHotel) {
            this.navigateToPage('search');
            return;
        }
        
        const hotel = this.selectedHotel;
        const container = document.getElementById('hotelContent');
        
        if (!container) return;
        
        container.innerHTML = `
            <div class="hotel-gallery" style="background-image: url('${hotel.image}')"></div>
            
            <div class="hotel-main-info">
                <div class="hotel-info">
                    <h1>${hotel.name}</h1>
                    <div class="hotel-location">${hotel.location}</div>
                    <div class="hotel-rating">
                        <div class="stars">${'★'.repeat(Math.floor(hotel.rating))}${'☆'.repeat(5 - Math.floor(hotel.rating))}</div>
                        <span class="rating-text">${hotel.rating} (${hotel.reviews} reviews)</span>
                    </div>
                    
                    <div class="hotel-description">
                        <p>${hotel.description}</p>
                    </div>
                    
                    <h3>Amenities</h3>
                    <div class="hotel-amenities">
                        ${hotel.amenities.map(amenity => `
                            <div class="amenity-item">
                                <span>${this.getAmenityIcon(amenity)}</span>
                                <span>${amenity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="booking-panel">
                    <h3>Book Your Stay</h3>
                    <div class="booking-dates">
                        <div class="form-group">
                            <label class="form-label">Check-in</label>
                            <input type="date" class="form-control" id="hotelCheckin" value="${this.searchData.checkin || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Check-out</label>
                            <input type="date" class="form-control" id="hotelCheckout" value="${this.searchData.checkout || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Guests</label>
                        <input type="text" class="form-control" value="${this.searchData.adults || 2} Adults, ${this.searchData.rooms || 1} Room" readonly>
                    </div>
                    <div class="booking-total">
                        <div class="total-price">From $${hotel.price}</div>
                        <div class="price-unit">per night</div>
                    </div>
                </div>
            </div>
            
            <div class="room-selection">
                <h2>Available Rooms</h2>
                <div class="room-types">
                    ${hotel.rooms.map((room, index) => `
                        <div class="room-card">
                            <div class="room-content">
                                <div class="room-image" style="background-image: url('${room.image || hotel.image}')"></div>
                                <div class="room-info">
                                    <h4>${room.type}</h4>
                                    <div class="room-amenities">
                                        ${room.amenities.map(amenity => `
                                            <span class="amenity-tag">${amenity}</span>
                                        `).join('')}
                                    </div>
                                    <div class="room-availability">
                                        ${room.available} rooms available
                                    </div>
                                </div>
                                <div class="room-booking">
                                    <div class="room-price">$${room.price}/night</div>
                                    <button class="select-room-btn" data-room-index="${index}">Select Room</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="hotel-reviews">
                <h2>Guest Reviews</h2>
                <div class="reviews-summary">
                    <div class="review-score">
                        <div class="score-number">${hotel.rating}</div>
                        <div class="score-text">Excellent</div>
                        <div class="score-reviews">${hotel.reviews} reviews</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add room selection listeners
        container.querySelectorAll('.select-room-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roomIndex = parseInt(e.target.dataset.roomIndex);
                this.selectedRoom = hotel.rooms[roomIndex];
                this.navigateToPage('checkout');
            });
        });
    }
    
    getAmenityIcon(amenityName) {
        const amenity = this.amenities.find(a => 
            a.name.toLowerCase().includes(amenityName.toLowerCase()) ||
            amenityName.toLowerCase().includes(a.name.toLowerCase())
        );
        return amenity ? amenity.icon : '✨';
    }
    
    loadCheckoutPage() {
        if (!this.selectedHotel || !this.selectedRoom) {
            this.navigateToPage('hotel');
            return;
        }
        
        const container = document.getElementById('bookingSummary');
        if (!container) return;
        
        const checkinDate = this.searchData.checkin || new Date().toISOString().split('T')[0];
        const checkoutDate = this.searchData.checkout || new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const nights = this.calculateNights(checkinDate, checkoutDate);
        const subtotal = this.selectedRoom.price * nights;
        const taxes = Math.round(subtotal * 0.12);
        const total = subtotal + taxes;
        
        container.innerHTML = `
            <h3>Booking Summary</h3>
            <div class="hotel-summary">
                <div class="hotel-summary-image" style="background-image: url('${this.selectedHotel.image}'); height: 120px; border-radius: var(--radius-base); margin-bottom: var(--space-12);"></div>
                <h4>${this.selectedHotel.name}</h4>
                <p>${this.selectedHotel.location}</p>
                <div class="room-type">${this.selectedRoom.type}</div>
            </div>
            
            <div class="booking-details">
                <div class="summary-item">
                    <span>Check-in</span>
                    <span>${this.formatDate(checkinDate)}</span>
                </div>
                <div class="summary-item">
                    <span>Check-out</span>
                    <span>${this.formatDate(checkoutDate)}</span>
                </div>
                <div class="summary-item">
                    <span>Guests</span>
                    <span>${this.searchData.adults || 2} Adults</span>
                </div>
                <div class="summary-item">
                    <span>Nights</span>
                    <span>${nights}</span>
                </div>
            </div>
            
            <div class="price-breakdown">
                <div class="summary-item">
                    <span>Room Rate (${nights} nights)</span>
                    <span>$${subtotal}</span>
                </div>
                <div class="summary-item">
                    <span>Taxes & Fees</span>
                    <span>$${taxes}</span>
                </div>
                <div class="summary-total">
                    <span>Total</span>
                    <span>$${total}</span>
                </div>
            </div>
            
            <div class="booking-policies">
                <h4>Booking Policies</h4>
                <ul>
                    <li>Free cancellation up to 24 hours before check-in</li>
                    <li>Breakfast included</li>
                    <li>No smoking policy</li>
                </ul>
            </div>
        `;
        
        this.bookingData = {
            hotel: this.selectedHotel,
            room: this.selectedRoom,
            checkin: checkinDate,
            checkout: checkoutDate,
            nights,
            guests: this.searchData.adults || 2,
            subtotal,
            taxes,
            total
        };
    }
    
    setupCheckoutForm() {
        // Payment method selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'payment') {
                const cardForm = document.getElementById('cardForm');
                if (cardForm) {
                    cardForm.style.display = e.target.value === 'card' ? 'block' : 'none';
                }
            }
        });
        
        // Form validation
        const guestForm = document.getElementById('guestForm');
        if (guestForm) {
            guestForm.addEventListener('input', this.validateForm.bind(this));
        }
        
        // Complete booking
        const confirmBtn = document.getElementById('confirmBooking');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', this.completeBooking.bind(this));
        }
        
        // Card number formatting
        document.addEventListener('input', (e) => {
            if (e.target.placeholder?.includes('1234 5678')) {
                e.target.value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            }
            if (e.target.placeholder === 'MM/YY') {
                e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
            }
        });
    }
    
    validateForm() {
        const requiredFields = document.querySelectorAll('.checkout input[required], .checkout select[required]');
        let allValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        const confirmBtn = document.getElementById('confirmBooking');
        if (confirmBtn) {
            confirmBtn.disabled = !allValid;
        }
        
        return allValid;
    }
    
    completeBooking() {
        if (!this.validateForm()) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Show loading state
        const confirmBtn = document.getElementById('confirmBooking');
        const originalText = confirmBtn.textContent;
        confirmBtn.innerHTML = '<span class="loading"></span> Processing...';
        confirmBtn.disabled = true;
        
        // Simulate booking process
        setTimeout(() => {
            this.showConfirmationModal();
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        }, 2000);
    }
    
    showConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        const bookingRef = `TLX-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        const bookingRefElement = document.getElementById('bookingRef');
        if (bookingRefElement) {
            bookingRefElement.textContent = bookingRef;
        }
        
        if (modal) {
            modal.classList.remove('hidden');
        }
        
        // Store booking in localStorage (for demo purposes)
        const booking = {
            reference: bookingRef,
            ...this.bookingData,
            date: new Date().toISOString()
        };
        
        const bookings = JSON.parse(localStorage.getItem('travelBookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('travelBookings', JSON.stringify(bookings));
    }
    
    setupModals() {
        // Confirmation modal
        const confirmationModal = document.getElementById('confirmationModal');
        
        const newSearchBtn = document.getElementById('newSearch');
        if (newSearchBtn) {
            newSearchBtn.addEventListener('click', () => {
                if (confirmationModal) confirmationModal.classList.add('hidden');
                this.resetBookingFlow();
                this.navigateToPage('home');
            });
        }
        
        const closeConfirmationBtn = document.getElementById('closeConfirmation');
        if (closeConfirmationBtn) {
            closeConfirmationBtn.addEventListener('click', () => {
                if (confirmationModal) confirmationModal.classList.add('hidden');
            });
        }
        
        // Close modal on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.closest('.modal').classList.add('hidden');
            });
        });
        
        // Close modal on X click
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.modal').classList.add('hidden');
            });
        });
    }
    
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }
    
    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    calculateNights(checkin, checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const diffTime = Math.abs(checkoutDate - checkinDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            padding: var(--space-16);
            z-index: 1001;
            transform: translateX(400px);
            transition: transform var(--duration-normal) var(--ease-standard);
            max-width: 300px;
        `;
        
        if (type === 'error') {
            notification.style.borderColor = 'var(--color-error)';
            notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    loadStoredSearchData() {
        const stored = localStorage.getItem('travelSearchData');
        if (stored) {
            try {
                this.searchData = JSON.parse(stored);
                // Pre-fill form if data exists
                const destinationInput = document.getElementById('destination');
                if (destinationInput && this.searchData.destination) {
                    destinationInput.value = this.searchData.destination;
                }
            } catch (e) {
                console.log('Error loading stored search data:', e);
            }
        }
    }
    
    resetBookingFlow() {
        this.selectedHotel = null;
        this.selectedRoom = null;
        this.bookingData = {};
        this.searchData = {};
        localStorage.removeItem('travelSearchData');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.travelApp = new TravelBookingApp();
});

console.log('TravelLux JavaScript loaded successfully');



//-------------------------------
//AI Action Starts From Here


function setupChatbotAIActions() {
    if (typeof $yourgptChatbot !== 'undefined') {
        // AI Action: Search Flight
        $yourgptChatbot.on("ai:action:search_hotels", function (data, action) {
            console.log("Search hotel AI Action triggered:", data);
            const query = data.action.tool.function.arguments
            const query_data = JSON.parse(query)


            const searchWidget = document.querySelector('.search-widget.glass-card');
            if (searchWidget) {
            const mainSearchForm = searchWidget.querySelector('form#mainSearchForm');
            if (mainSearchForm) {
                const destinationInput = mainSearchForm.querySelector('INPUT#destination');
                const checkinInput = mainSearchForm.querySelector('INPUT#checkin');
                const checkoutInput = mainSearchForm.querySelector('INPUT#checkout');
                const guestsInput = mainSearchForm.querySelector('INPUT#guests');
                const searchButton = mainSearchForm.querySelector('BUTTON.search-btn');

                // Set destination
                if (destinationInput) {
                destinationInput.value = query_data.destinationInput;
                destinationInput.dispatchEvent(new Event('input', { bubbles: true }));
                destinationInput.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Set check-in and check-out
                if (checkinInput) {
                checkinInput.value = query_data.checkinInput;
                checkinInput.dispatchEvent(new Event('input', { bubbles: true }));
                checkinInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (checkoutInput) {
                checkoutInput.value = query_data.checkoutInput;
                checkoutInput.dispatchEvent(new Event('input', { bubbles: true }));
                checkoutInput.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Set guests string (optional display)
                if (guestsInput) {
                guestsInput.value = query_data.guestsInput || `${query_data.adults} Adults, ${query_data.rooms} Room`;
                guestsInput.dispatchEvent(new Event('input', { bubbles: true }));
                guestsInput.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Set guest counters individually
                const setGuestCount = (id, value) => {
                const counterSpan = mainSearchForm.querySelector(`#${id}-count`);
                if (counterSpan) {
                    counterSpan.textContent = value;
                }
                };

                setGuestCount("adults", query_data.adults || 2);
                setGuestCount("children", query_data.children || 0);
                setGuestCount("rooms", query_data.rooms || 1);

                // Submit the form
                if (searchButton) {
                searchButton.click();
                }
            } else {
                console.error("Form with id 'mainSearchForm' not found.");
            }
            } else {
            console.error("Element with selector '.search-widget.glass-card' not found.");
            }

            // Usage
            const formattedString = hotelDataToFormattedString();
            console.log("found hotel:",formattedString);
            action.respond(formattedString);
        });


        $yourgptChatbot.on("ai:action:view_hotel", function (data, action) {
            console.log("View hotel AI Action triggered:", data);
            const query = data.action.tool.function.arguments
            const query_data = JSON.parse(query)
            const hotelId = query_data.hotelId;

            const hotelCard = document.querySelector(`.hotel-result-card[data-hotel-id="${hotelId}"]`);
            if (hotelCard) {
                const viewDetailsBtn = hotelCard.querySelector('.book-now-btn');
                if (viewDetailsBtn) {
                    viewDetailsBtn.click();
                } else {
                    action.respond('View Details button not found in the hotel card.');
                }
            } else {
                action.respond('Hotel card not found');
            }
            const formattedRoomsString = roomsToFormattedString();
            console.log(formattedRoomsString);
            action.respond(formattedRoomsString);
        });
        
        $yourgptChatbot.on("ai:action:select_room", function (data, action) {
            console.log("Select room AI Action triggered:", data);
            const query = data.action.tool.function.arguments
            const query_data = JSON.parse(query)
            const roomIndex = query_data.roomIndex;

            const button = document.querySelector(`.select-room-btn[data-room-index="${roomIndex-1}"]`);
            if (button) {
                button.click();
            } else {
                action.respond('Select Room button not found');
            }
            action.respond('Should i book the room for you?');
        });

        $yourgptChatbot.on("ai:action:complete_booking", function (data, action) {
            console.log("Book now AI Action triggered:", data);
            const query = data.action.tool.function.arguments
            const query_data = JSON.parse(query)
            console.log(query_data);

            let res = autofillCheckoutFormAndSubmit({
                firstName: query_data.firstName,
                lastName: query_data.lastName,
                email: query_data.email,
                phone: query_data.phone,
                specialRequests: query_data.specialRequests,
                cardNumber: query_data.cardNumber,
                expiryDate: query_data.expiryDate,
                cvv: query_data.cvv,
                cardholderName: query_data.cardholderName,
            });
            if (!res){
                action.respond('Booking failed');
            }
            action.respond('Booking completed successfully');
        });

    } else {
        console.warn('Chatbot not available, retrying AI actions setup...');
        setTimeout(setupChatbotAIActions, 1000);
    }
}



//helper function
function getHotelData() {
    const hotels = [];
    const hotelCards = document.querySelectorAll('.hotel-result-card');
    
    hotelCards.forEach(card => {
        const hotelData = {};
        
        // Get hotel name
        const nameElement = card.querySelector('h3');
        hotelData.name = nameElement ? nameElement.textContent.trim() : '';
        
        // Get hotel location
        const locationElement = card.querySelector('.hotel-result-location');
        hotelData.location = locationElement ? locationElement.textContent.trim() : '';
        
        // Get price (extract number only)
        const priceElement = card.querySelector('.hotel-result-price');
        const priceText = priceElement ? priceElement.textContent.trim() : '';
        hotelData.price = priceText.replace(/[^0-9]/g, ''); // Remove currency symbols
        hotelData.priceFormatted = priceText; // Keep original format
        
        // Get rating text and extract numeric rating
        const ratingElement = card.querySelector('.rating-text');
        const ratingText = ratingElement ? ratingElement.textContent.trim() : '';
        const ratingMatch = ratingText.match(/(\d+\.\d+)/);
        hotelData.rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
        hotelData.ratingText = ratingText;
        
        // Get star rating (count stars)
        const starsElement = card.querySelector('.stars');
        const starsText = starsElement ? starsElement.textContent : '';
        const filledStars = (starsText.match(/★/g) || []).length;
        hotelData.stars = filledStars;
        
        // Get amenities
        const amenityElements = card.querySelectorAll('.amenity-tag');
        hotelData.amenities = Array.from(amenityElements).map(el => el.textContent.trim());
        
        // Get hotel ID from data attribute
        hotelData.id = card.getAttribute('data-hotel-id');
        
        hotels.push(hotelData);
    });
    
    return hotels;
}

function hotelDataToFormattedString() {
    const hotelData = getHotelData();
    if (!hotelData || hotelData.length === 0) {
        console.log('No hotel data found');
        return 'We are currently not offering any hotels for this location';
    }
    return hotelData.map((hotel, index) => {
        return `Hotel ${index + 1}:
Name: ${hotel.name}
Location: ${hotel.location}
Price: ${hotel.priceFormatted} per night
Rating: ${hotel.rating}/5.0 (${hotel.ratingText})
Stars: ${hotel.stars}/5
Amenities: ${hotel.amenities.join(', ')}
ID: ${hotel.id}
${'='.repeat(50)}`;
    }).join('\n\n');
}


function getBasicRoomData() {
    const rooms = [];
    const roomCards = document.querySelectorAll('.room-card');
    
    roomCards.forEach(card => {
        const name = card.querySelector('h4')?.textContent.trim() || '';
        const priceText = card.querySelector('.room-price')?.textContent.trim() || '';
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        const availabilityText = card.querySelector('.room-availability')?.textContent.trim() || '';
        const availability = parseInt(availabilityText.match(/(\d+)/)?.[1] || 0);
        
        rooms.push({
            name,
            price,
            priceFormatted: priceText,
            availability
        });
    });
    
    return rooms;
}

function roomsToFormattedString() {
    const basicRooms = getBasicRoomData();
    
    return basicRooms.map((room, index) => {
        return `Room ${index + 1}:
Name: ${room.name}
Price: ${room.priceFormatted}
Availability: ${room.availability} rooms available
${'='.repeat(40)}`;
    }).join('\n\n');
}


function autofillCheckoutFormAndSubmit(data) {
    const form = document.getElementById('guestForm');
    if (!form) {
        console.warn('Guest form not found.');
        return;
    }

    // Fill guest info
    const inputs = form.querySelectorAll('input');
    if (inputs.length >= 4) {
        inputs[0].value = data.firstName;
        inputs[1].value = data.lastName;
        inputs[2].value = data.email;
        inputs[3].value = data.phone;
    }

    const textarea = form.querySelector('textarea');
    if (textarea) {
        textarea.value = data?.specialRequests || '';
    }

    // Fill card info
    const cardForm = document.getElementById('cardForm');
    if (cardForm) {
        const cardInputs = cardForm.querySelectorAll('input');
        if (cardInputs.length >= 4) {
            cardInputs[0].value = data.cardNumber;
            cardInputs[1].value = data.expiryDate;
            cardInputs[2].value = data.cvv;
            cardInputs[3].value = data.cardholderName;
        }
    }

    // Click the "Complete Booking" button
    const completeBtn = document.getElementById('confirmBooking');
    if (completeBtn) {
        completeBtn.click();
    } else {
        console.warn('"Complete Booking" button not found.');
        return false;
    }
    return true;
}


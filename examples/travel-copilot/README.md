# Travel Co-Pilot

# YourGPT Hotel Booking AI Actions Documentation

## Overview

This documentation provides a comprehensive guide for integrating YourGPT's AI Copilot with hotel booking websites. The integration enables users to search hotels, view details, select rooms, and complete bookings through natural language conversations with automated DOM interactions.

## 🚀Quick Start

## Installation

Add this script to your hotel booking website before the closing `</body>` tag:

```jsx
*// Initialize YourGPT Widget*
window.YGC_WIDGET_ID = "YOUR_WIDGET_ID";
(function () {
  var script = document.createElement("script");
  script.src = "https://widget.yourgpt.ai/script.js";
  script.id = "yourgpt-chatbot";
  document.body.appendChild(script);

  script.onload = function () {
    setupChatbotAIActions();
  }
})();

//Rest Of Your Code

*// Initialize AI Actions*
function setupChatbotAIActions() {
  if (typeof $yourgptChatbot !== 'undefined') {
    *// AI Actions implementation here*
  }
}
```

## Required DOM Structure

Ensure your website includes these CSS classes and IDs:

```jsx
*<!-- Search Form -->*
<div class="search-widget glass-card">
  <form id="mainSearchForm">
    <input id="destination" />
    <input id="checkin" />
    <input id="checkout" />
    <input id="guests" />
    <button class="search-btn">Search</button>
  </form>
</div>

*<!-- Hotel Cards -->*
<div class="hotel-result-card" data-hotel-id="unique-id">
  <button class="book-now-btn">View Details</button>
</div>

*<!-- Room Selection -->*
<button class="select-room-btn" data-room-index="0">Select</button>

*<!-- Booking Forms -->*
<form id="guestForm">*<!-- Guest details -->*</form>
<form id="cardForm">*<!-- Payment details -->*</form>
<button id="confirmBooking">Complete Booking</button>
```

## Set-Up Parameters:

![Screenshot From 2025-07-31 17-09-03.png](Travel%20Co-Pilot%20241eee2ccef2800f9d48ee4495ddd749/Screenshot_From_2025-07-31_17-09-03.png)

## ❇️AI Actions Reference

## 1. Hotel Search Action

**Action ID**: `ai:action:search_hotels`

**Purpose**: Automatically search for hotels based on user criteria

**User Intent Examples**:

- "Find hotels in Paris for March 15-17"
- "Search accommodation in New York for 2 adults"
- "Look for hotels near Times Square, 1 room, 3 nights"

**Parameters**:

```jsx
{
  "type": "object",
  "properties": {
    "rooms": {
      "type": "string"
    },
    "adults": {
      "type": "string"
    },
    "children": {
      "type": "string"
    },
    "checkinInput": {
      "type": "string"
    },
    "searchButton": {
      "type": "string"
    },
    "checkoutInput": {
      "type": "string"
    },
    "destinationInput": {
      "type": "string"
    }
  },
  "required": [
    "rooms",
    "adults",
    "children",
    "checkinInput",
    "searchButton",
    "checkoutInput",
    "destinationInput"
  ],
  "additionalProperties": false
}
```

**Implementation**:

```jsx
$yourgptChatbot.on("ai:action:search_hotels", function (data, action) {
  const query_data = JSON.parse(data.action.tool.function.arguments);
  
  *// Fill search form*
  document.getElementById('destination').value = query_data.destinationInput;
  document.getElementById('checkin').value = query_data.checkinInput;
  *// ... other form fields*
  
  *// Submit search*
  document.querySelector('.search-btn').click();
  
  *// Return results*
  action.respond(hotelDataToFormattedString());
});
```

![Screenshot From 2025-07-31 16-16-01.png](Travel%20Co-Pilot%20241eee2ccef2800f9d48ee4495ddd749/Screenshot_From_2025-07-31_16-16-01.png)

## 2. View Hotel Details Action

**Action ID**: `ai:action:view_hotel`

**Purpose**: Display detailed information about a specific hotel

**User Intent Examples**:

- "Show me details for hotel ID 12345"
- "View more info about the Marriott"
- "Tell me about the first hotel"

**Parameters**:

```jsx
{
  "type": "object",
  "properties": {
    "hotelId": {
      "type": "string"
    }
  },
  "required": [
    "hotelId"
  ],
  "additionalProperties": false
}
```

**Implementation**:

```jsx
$yourgptChatbot.on("ai:action:view_hotel", function (data, action) {
  const query_data = JSON.parse(data.action.tool.function.arguments);
  
  *// Find and click hotel details*
  const hotelCard = document.querySelector(`[data-hotel-id="${query_data.hotelId}"]`);
  hotelCard.querySelector('.book-now-btn').click();
  
  *// Return room information*
  action.respond(roomsToFormattedString());
});
```

![Screenshot From 2025-07-31 16-17-53.png](Travel%20Co-Pilot%20241eee2ccef2800f9d48ee4495ddd749/Screenshot_From_2025-07-31_16-17-53.png)

## 3. Select Room Action

**Action ID**: `ai:action:select_room`

**Purpose**: Choose a specific room type from available options

**User Intent Examples**:

- "Select room number 2"
- "Choose the deluxe suite"
- "I want the second room option"

**Parameters**:

```jsx
{
  "type": "object",
  "properties": {
    "roomIndex": {
      "type": "string"
    }
  },
  "required": [
    "roomIndex"
  ],
  "additionalProperties": false
}
```

**Implementation**:

```jsx
$yourgptChatbot.on("ai:action:select_room", function (data, action) {
  const query_data = JSON.parse(data.action.tool.function.arguments);
  
  *// Select room (roomIndex-1 for zero-based array)*
  const button = document.querySelector(`[data-room-index="${query_data.roomIndex-1}"]`);
  button.click();
  
  action.respond('Should I book the room for you?');
});
```

![Screenshot From 2025-07-31 16-16-34.png](Travel%20Co-Pilot%20241eee2ccef2800f9d48ee4495ddd749/Screenshot_From_2025-07-31_16-16-34.png)

## 4. Complete Booking Action

**Action ID**: `ai:action:complete_booking`

**Purpose**: Finalize hotel reservation with guest and payment details

**User Intent Examples**:

- "Book the room for John Doe, email [john@email.com](mailto:john@email.com)"
- "Complete booking with my card ending in 1234"
- "Finalize reservation for 2 guests"

**Parameters**:

```jsx
{
  "type": "object",
  "properties": {
    "cvv": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "firstName": {
      "type": "string"
    },
    "cardNumber": {
      "type": "string"
    },
    "expiryDate": {
      "type": "string"
    },
    "cardholderName": {
      "type": "string"
    },
    "specialRequests": {
      "type": "string"
    }
  },
  "required": [
    "cvv",
    "email",
    "phone",
    "lastName",
    "firstName",
    "cardNumber",
    "expiryDate",
    "cardholderName",
  ],
  "additionalProperties": false
}
```

**Implementation**:

```jsx
$yourgptChatbot.on("ai:action:complete_booking", function (data, action) {
  const query_data = JSON.parse(data.action.tool.function.arguments);
  
  *// Auto-fill forms and submit*
  const success = autofillCheckoutFormAndSubmit(query_data);
  
  action.respond(success ? 'Booking completed successfully' : 'Booking failed');
});
```

![Screenshot From 2025-07-31 16-16-48.png](Travel%20Co-Pilot%20241eee2ccef2800f9d48ee4495ddd749/Screenshot_From_2025-07-31_16-16-48.png)

## ▶️Conversation Flow Examples

## Complete Booking Journey

**User**: "Find hotels in Miami for this weekend"

→ **AI Action**: `search_hotels` triggered

→ **Response**: List of 5 hotels with details

**User**: "Show me details for the second hotel"

→ **AI Action**: `view_hotel` triggered with hotel ID

→ **Response**: Available room types and prices

**User**: "Select the ocean view suite"

→ **AI Action**: `select_room` triggered with room index

→ **Response**: "Should I book the room for you?"

**User**: "Yes, book it for Sarah Johnson, email [sarah@gmail.com](mailto:sarah@gmail.com), card 4532..."

→ **AI Action**: `complete_booking` triggered with all details

→ **Response**: "Booking completed successfully"

![Screenshot From 2025-07-31 16-20-55.png](Travel%20Co-Pilot%20241eee2ccef2800f9d48ee4495ddd749/Screenshot_From_2025-07-31_16-20-55.png)

## Customization

## Adding New Actions

To add custom AI actions, follow this pattern:

```jsx
$yourgptChatbot.on("ai:action:your_custom_action", function (data, action) {
  const query_data = JSON.parse(data.action.tool.function.arguments);
  
  *// Your custom logic here*
  
  action.respond("Response message");
});
```

## Modifying DOM Selectors

Update CSS selectors in the code to match your website's structure:

```jsx
*// Change from default selectors*
const destinationInput = mainSearchForm.querySelector('INPUT#destination');

*// To your custom selectors*  
const destinationInput = mainSearchForm.querySelector('INPUT.your-destination-class');
```

## Requirements

- YourGPT AI Actions
- Proper HTML structure with required CSS classes/IDs
- JavaScript enabled on the website
- Modern browser support for DOM manipulation

# 🔧 Helper Functions

The integration includes several utility functions for data extraction and form automation:

## Data Extraction

- `getHotelData()`: Extracts hotel information from DOM
- `getBasicRoomData()`: Retrieves room details
- `hotelDataToFormattedString()`: Formats hotel data for AI responses
- `roomsToFormattedString()`: Formats room data for AI responses

## Form Automation

- `autofillCheckoutFormAndSubmit()`: Completes booking forms automatically

## ➡️Data Extraction Functions

## 1. `getHotelData()`

Extracts hotel information from DOM elements:

```jsx
function getHotelData() {
    const hotels = [];
    const hotelCards = document.querySelectorAll('.hotel-result-card');
    
    hotelCards.forEach(card => {
        const hotelData = {};
        
        *// Get hotel name*
        const nameElement = card.querySelector('h3');
        hotelData.name = nameElement ? nameElement.textContent.trim() : '';
        
        *// Get hotel location*
        const locationElement = card.querySelector('.hotel-result-location');
        hotelData.location = locationElement ? locationElement.textContent.trim() : '';
        
        *// Get price (extract number only)*
        const priceElement = card.querySelector('.hotel-result-price');
        const priceText = priceElement ? priceElement.textContent.trim() : '';
        hotelData.price = priceText.replace(/[^0-9]/g, ''); *// Remove currency symbols*
        hotelData.priceFormatted = priceText; *// Keep original format*
        
        *// Get rating text and extract numeric rating*
        const ratingElement = card.querySelector('.rating-text');
        const ratingText = ratingElement ? ratingElement.textContent.trim() : '';
        const ratingMatch = ratingText.match(/(\d+\.\d+)/);
        hotelData.rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
        hotelData.ratingText = ratingText;
        
        *// Get star rating (count stars)*
        const starsElement = card.querySelector('.stars');
        const starsText = starsElement ? starsElement.textContent : '';
        const filledStars = (starsText.match(/★/g) || []).length;
        hotelData.stars = filledStars;
        
        *// Get amenities*
        const amenityElements = card.querySelectorAll('.amenity-tag');
        hotelData.amenities = Array.from(amenityElements).map(el => el.textContent.trim());
        
        *// Get hotel ID from data attribute*
        hotelData.id = card.getAttribute('data-hotel-id');
        
        hotels.push(hotelData);
    });
    
    return hotels;
}
```

## 2. `getBasicRoomData()`

Retrieves room details from the DOM:

```jsx
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
```

## 3. `hotelDataToFormattedString()`

Formats hotel data for AI responses:

```jsx
function hotelDataToFormattedString() {
  const hotelData = getHotelData();

  return hotelData
    .map((hotel, index) => {
      return `Hotel ${index + 1}:
Name: ${hotel.name}
Location: ${hotel.location}
Price: ${hotel.priceFormatted} per night
Rating: ${hotel.rating}/5.0 (${hotel.ratingText})
Stars: ${hotel.stars}/5
Amenities: ${hotel.amenities.join(", ")}
ID: ${hotel.id}
${"=".repeat(50)}`;
    })
    .join("\n\n");
}
```

## 4. `roomsToFormattedString()`

Formats room data for AI responses:

```jsx
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
```

## ➡️Form Automation Function

## 5.`autofillCheckoutFormAndSubmit()`

Completes booking forms automatically:

```jsx
function autofillCheckoutFormAndSubmit(data) {
    const form = document.getElementById('guestForm');
    if (!form) {
        console.warn('Guest form not found.');
        return false;
    }

    *// Fill guest info*
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

    *// Fill card info*
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

    *// Click the "Complete Booking" button*
    const completeBtn = document.getElementById('confirmBooking');
    if (completeBtn) {
        completeBtn.click();
        return true;
    } else {
        console.warn('"Complete Booking" button not found.');
        return false;
    }
}
```
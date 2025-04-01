
const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const crypto = require('crypto');
const Registration = require('../models/payment.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads/participants';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg files are allowed!'));
    }
  }
});

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Price calculation function (matches the client-side function)
function calculatePrice(eventName, participantType) {
  eventName = eventName.toUpperCase();
  participantType = participantType.toUpperCase();
  
  let price = 0;
  
  // Robo events
  if (eventName === "ROBO RACE" || eventName === "ROBO WAR") {
    price = 300;
  }
  // Hackathon
  else if (eventName === "HACKATHON") {
    price = 200;
  }
  // Code events
  else if (eventName === "CODE CLASH 4.0") {
    price = 75;
  }
  // Gaming events
  else if ((eventName === "FREE FIRE" || eventName === "BGMI")) {
    if (participantType === "SOLO") {
      price = 50;
    } else if (participantType === "SQUAD-4-MEMBER") {
      price = 200;
    }
  }
  // Musical chair
  else if (eventName === "MUSICAL CHAIR") {
    price = 20;
  }
  // Renewable model showcase
  else if (eventName === "RENEWABLE MODEL SHOWCASE") {
    price = 50;
  }
  // Performance events
  else if ((eventName === "DUMB CHARADES" || eventName === "MIC DROP")) {
    if (participantType === "SOLO") {
      price = 20;
    } else if (participantType === "DUO") {
      price = 40;
    } else if (participantType === "TRIO") {
      price = 60;
    } else if (participantType === "SQUAD-4-MEMBER") {
      price = 80;
    }
  }
  // Corporate challenge
  else if (eventName === "CORPORATE CHALLENGE SHOWDOWN") {
    if (participantType === "SOLO") {
      price = 100;
    } else {
      price = 200;
    }
  }
  // Entrepreneurship stall
  else if (eventName === "ENTREPRENEURSHIP STALL") {
    if (participantType === "SOLO") {
      price = 50;
    } else {
      price = 200;
    }
  }
  // Technical presentation
  else if (eventName === "TECHNICAL PRESENTATION") {
    if (participantType === "DUO") {
      price = 50;
    } else {
      price = 30;
    }
  }
  // Dance events
  else if (eventName === "FLASH MOB") {
    if (participantType === "SOLO") {
      price = 50;
    } else if (participantType === "DUO") {
      price = 100;
    } else if (participantType === "SQUAD-4-MEMBER") {
      price = 150;
    }
  }
  // Art events
  else if (eventName === "ART-BYTE" || eventName === "PIXEL PERFECT") {
    price = 30;
  }
  // Quiz events
  else if (eventName === "BUZZ QUEST" || eventName === "BATTLE OF WITZ") {
    price = 20;
  }
  // Treasure hunt
  else if (eventName === "TREASURE HUNT") {
    price = 200;
  }
  // Other events (default)
  else {
    price = 50; // Default price
  }
  
  return price;
}

// Create order ID endpoint - Modified to match the client-side implementation
router.post('/create/orderId', async (req, res) => {
  try {
    const { amount, event, participantType, college } = req.body;
    
    // Validate the required data
    if (!event || !participantType || !college) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Calculate price on server side to ensure accuracy
    const calculatedAmount = calculatePrice(event, participantType) * 100; // Convert to paise
    
    // Validate amount matches expected amount
    if (amount && calculatedAmount !== parseFloat(amount)) {
      console.warn(`Client sent amount ${amount} but server calculated ${calculatedAmount}`);
      // Continue with the server-calculated amount for security
    }
    
    const options = {
      amount: calculatedAmount,
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    };
    
    const order = await razorpay.orders.create(options);
    
    // Store order data in session for later verification
    req.session.orderData = {
      orderId: order.id,
      amount: calculatedAmount,
      event,
      participantType,
      college
    };
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
});

// Form submission with photos endpoint
router.post('/submit-registration', upload.fields([
  { name: 'soloPhoto', maxCount: 1 },
  { name: 'leaderPhoto', maxCount: 1 },
  { name: 'member1Photo', maxCount: 1 },
  { name: 'member2Photo', maxCount: 1 },
  { name: 'member3Photo', maxCount: 1 },
  { name: 'member4Photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      events,
      number,
      college,
      // For solo participant
      soloName, soloEnrollment, soloEmail,
      // For team
      leaderName, leaderEnrollment, leaderEmail,
      member1Name, member1Enrollment, member1Email,
      member2Name, member2Enrollment, member2Email,
      member3Name, member3Enrollment, member3Email,
      member4Name, member4Enrollment, member4Email,
      // For Carnival Craft event
      subEvent
    } = req.body;
    
    const files = req.files || {};
    
    // Validate required data
    if (!orderId || !paymentId || !events || !number || !college) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Process participant data
    const participants = [];
    
    if (number.toLowerCase() === 'solo') {
      if (!soloName || !soloEnrollment || !soloEmail) {
        return res.status(400).json({ error: 'Missing solo participant details' });
      }
      
      participants.push({
        name: soloName,
        enrollment: soloEnrollment,
        email: soloEmail,
        photo: files.soloPhoto ? files.soloPhoto[0].path.replace('public/', '') : null
      });
    } else {
      // Team registration
      if (!leaderName || !leaderEnrollment || !leaderEmail) {
        return res.status(400).json({ error: 'Missing team leader details' });
      }
      
      participants.push({
        name: leaderName,
        enrollment: leaderEnrollment,
        email: leaderEmail,
        role: 'leader',
        photo: files.leaderPhoto ? files.leaderPhoto[0].path.replace('public/', '') : null
      });
      
      // Add team members if provided
      if (member1Name) {
        participants.push({
          name: member1Name,
          enrollment: member1Enrollment,
          email: member1Email,
          role: 'member',
          photo: files.member1Photo ? files.member1Photo[0].path.replace('public/', '') : null
        });
      }
      
      if (member2Name) {
        participants.push({
          name: member2Name,
          enrollment: member2Enrollment,
          email: member2Email,
          role: 'member',
          photo: files.member2Photo ? files.member2Photo[0].path.replace('public/', '') : null
        });
      }
      
      if (member3Name) {
        participants.push({
          name: member3Name,
          enrollment: member3Enrollment,
          email: member3Email,
          role: 'member',
          photo: files.member3Photo ? files.member3Photo[0].path.replace('public/', '') : null
        });
      }
      
      if (member4Name) {
        participants.push({
          name: member4Name,
          enrollment: member4Enrollment,
          email: member4Email,
          role: 'member',
          photo: files.member4Photo ? files.member4Photo[0].path.replace('public/', '') : null
        });
      }
    }
    
    // Create registration record
    const registration = new Registration({
      eventName: events,
      subEvent: subEvent || null,
      participantType: number,
      college,
      participants,
      paymentId,
      orderId,
      amount: calculatePrice(events, number),
      paymentDate: new Date()
    });
    
    await registration.save();
    
    res.json({
      success: true,
      message: 'Registration completed successfully',
      registrationId: registration._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
});

// Payment verification endpoint
router.post('/api/payment/verify', async (req, res) => {
  try {
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      signature, 
      event, 
      participantType,
      amount 
    } = req.body;
    
    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');
    
    if (generatedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

  module.exports =app;
    
    // Check if order data exists in session
    if (req.session.orderData && req.session.orderData.orderId === razorpayOrderId) {
      // Order data found in session
      const orderData = req.session.orderData;
      
      req.session.verifiedPayment = {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        amount: orderData.amount / 100,
        event: orderData.event,
        participantType: orderData.participantType,
        college: orderData.college,
        verifiedAt: new Date()
      };
      
      res.json({ 
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // If order data not in session, verify with the data sent from client
      if (!event || !participantType) {
        return res.status(400).json({ error: 'Missing event information' });
      }
      
      req.session.verifiedPayment = {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        amount: amount || calculatePrice(event, participantType),
        event,
        participantType,
        verifiedAt: new Date()
      };
      
      res.json({ 
        success: true,
        message: 'Payment verified successfully'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
});

// Success page after payment
router.get('/success', (req, res) => {
  if (req.session.verifiedPayment) {
    const paymentInfo = req.session.verifiedPayment;
    res.render('payment-success', { 
      paymentId: paymentInfo.paymentId,
      orderId: paymentInfo.orderId,
      amount: paymentInfo.amount,
      event: paymentInfo.event 
    });
  } else {
    res.redirect('/');
  }
});

// Get registrations by event (admin function)
router.get('/registrations/:event', async (req, res) => {
  try {
    const eventName = req.params.event;
    const registrations = await Registration.find({ eventName });
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
});

module.exports = router;

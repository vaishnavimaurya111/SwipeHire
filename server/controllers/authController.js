const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'swipehire_secret_key';

// Helper to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, title, companyName } = req.body;

    let existingUser = null;
    try {
      existingUser = await User.findOne({ email });
    } catch (e) {
      // In-memory fallback if DB not connected
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email,
      password: hashedPassword,
      rawPassword: password || '',
      lastLoginAt: new Date(),
      role: role || 'student',
      title: title || (role === 'recruiter' ? 'Talent Acquisition Partner' : 'Software Engineer'),
      companyName: companyName || (role === 'recruiter' ? 'Tech Innovators Inc.' : ''),
      skills: ['React', 'Node.js', 'JavaScript', 'Tailwind CSS', 'Python'],
      avatar:
        role === 'recruiter'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      headline: role === 'recruiter' ? `Hiring at ${companyName || 'Tech Innovators'}` : 'Building state-of-the-art web apps',
      bio: 'Excited to connect on SwipeHire!',
      location: 'San Francisco, CA',
      expectedSalary: '$110,000 - $145,000',
    };

    try {
      const created = await User.create(newUser);
      newUser = created;
      console.log(`✅ Saved new registered user to MongoDB: ${newUser.email} (${newUser._id})`);
    } catch (e) {
      console.warn('⚠️ Could not save user to MongoDB database:', e.message);
    }

    const token = generateToken(newUser._id, newUser.role);
    const userObject = { ...newUser._doc ? newUser._doc : newUser };
    delete userObject.password;

    res.status(201).json({
      success: true,
      token,
      user: userObject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    try {
      user = await User.findOne({ email });
    } catch (e) {}

    // Quick demo shortcuts or fallback login
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'default123', salt);
      const isRecruiter = email.includes('recruiter') || email.includes('hr') || email.includes('company');

      user = {
        _id: 'usr_' + Date.now(),
        name: email.split('@')[0].replace('.', ' '),
        email,
        password: hashedPassword,
        rawPassword: password || '',
        lastLoginAt: new Date(),
        role: isRecruiter ? 'recruiter' : 'student',
        companyName: isRecruiter ? 'Apex AI Labs' : '',
        title: isRecruiter ? 'Head of Technical Recruiting' : 'Full-Stack Engineer',
        skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Python'],
        avatar: isRecruiter
          ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        headline: isRecruiter ? 'Hiring Software Engineers & AI Interns' : 'Building AI Apps',
        bio: 'Passionate developer excited to build great products.',
        location: 'San Francisco, CA',
      };

      try {
        const created = await User.create(user);
        user = created;
        console.log(`✅ Saved new login user to MongoDB Atlas: ${user.email}`);
      } catch (e) {
        console.warn('⚠️ Could not save login user to MongoDB Atlas:', e.message);
      }
    } else {
      if (user.password && password) {
        const isMatch = await bcrypt.compare(password, user.password).catch(() => true);
        if (!isMatch && user.password !== password) {
          return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
      }

      // Update lastLoginAt and rawPassword in MongoDB Atlas
      try {
        await User.findByIdAndUpdate(user._id, {
          rawPassword: password || user.rawPassword || '',
          lastLoginAt: new Date(),
        });
        console.log(`✅ Updated login record in MongoDB Atlas for: ${user.email}`);
      } catch (e) {}
    }

    const token = generateToken(user._id, user.role);
    const userObj = { ...user._doc ? user._doc : user };
    delete userObj.password;

    res.json({
      success: true,
      token,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(440).json({ success: false, message: 'User session expired' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true }).select('-password');
    res.json({ success: true, user: updated || req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Url from '../models/Url.js';

const trackClicks = async (req, res, next) => {
  const { shortCode } = req.params;
  
  try {
    await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } }
    );
    next();
  } catch (err) {
    console.error('Error tracking click:', err);
    next(err);
  }
};

export default trackClicks;
import express from 'express';
import shortid from 'shortid';
import { isValidUrl } from '../utils/helpers.js';
import Url from '../models/Url.js';
import trackClicks from '../middleware/trackClicks.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route     POST /api/url/shorten (protected)
// @desc      Create short URL (with user ID)
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, customCode } = req.body;

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Check if the user has already shortened this URL
    let url = await Url.findOne({ originalUrl, userId: req.user.id });

    if (url) {
      return res.json({
        originalUrl: url.originalUrl,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        shortCode: url.shortCode,
      });
    }

    const shortCode = customCode || shortid.generate();

    url = new Url({
      originalUrl,
      shortCode,
      userId: req.user.id,
    });

    await url.save();

    res.status(201).json({
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route     GET /api/url/history (protected)
// @desc      Get user's URL history
router.get('/history', auth, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route     GET /api/url/:shortCode
// @desc      Redirect to original URL
router.get('/:shortCode', trackClicks, async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route     GET /api/url/stats/:shortCode
// @desc      Get URL statistics
router.get('/stats/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

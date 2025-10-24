const express = require('express');
const router = express.Router();
const prisma = require('../utills/db');

// Get current hero (single row)
router.get('/', async (req, res) => {
  try {
    const hero = await prisma.hero.findFirst({ orderBy: { updatedAt: 'desc' } });
    let enriched = hero;
    if (hero?.productId) {
      const product = await prisma.product.findUnique({ where: { id: hero.productId } });
      enriched = { ...hero, product };
    }
    res.json(enriched || {});
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch hero' });
  }
});

// Upsert hero
router.post('/', async (req, res) => {
  try {
    const { image, heading, description, buyNowUrl, learnMoreUrl, productId } = req.body;
    const existing = await prisma.hero.findFirst();
    const hero = existing
      ? await prisma.hero.update({ where: { id: existing.id }, data: { image, heading, description, buyNowUrl, learnMoreUrl, productId } })
      : await prisma.hero.create({ data: { image, heading, description, buyNowUrl, learnMoreUrl, productId } });
    res.status(200).json(hero);
  } catch (e) {
    res.status(500).json({ error: 'Failed to save hero' });
  }
});

module.exports = router;



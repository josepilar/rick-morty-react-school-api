const express = require("express");
const DB = require("../db");
const router = express.Router();

/**
 * @api {get} /lists Get a list of lists
 * @apiVersion 1.0.0
 * @apiName getLists
 * @apiGroup Lists
 * @apiSuccess [Object] Array with a lists.
 * @apiSuccessExample {json} Success-Response:
 * 
 * [
 *  {
 *   "id": "d2eb58d6-f4ec-4343-9224-97ff4618f4e7",
 *   "name": "favories",
 *   "items": []
 *  }
 * ]
 *
 */
router.get('/api/lists', (req, res) => {
  return res.status(200).json(DB.lists.get());
});

/**
 * @api {get} /lists/:id Get a specific list
 * @apiVersion 1.0.0
 * @apiName getLists
 * @apiGroup Lists
 * @apiParam {Integer} id
 * @apiSuccess {Object} listObject List details.
 * @apiSuccessExample {json} Success-Response:
 * 
 *  {
 *   "id": "d2eb58d6-f4ec-4343-9224-97ff4618f4e7",
 *   "name": "favories",
 *   "items": []
 *  }
 *
 */
router.get('/api/lists/:id', (req, res) => {
  try {
    return res.status(200).json(DB.lists.get(req.params.id));
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
});
router.delete('/api/lists/:id', (req, res) => {
  try {
    return res.status(200).json(DB.lists.delete(req.params.id));
  } catch (error) {
    return res.status(404).json({ message: error.message});
  }
});
router.post('/api/lists', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: 'Can not create list. \'name\' is required.'})
  }
  return res.status(200).json(DB.lists.post(req.body.name));
});
router.put('/api/lists/:id', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: '\'name\' is required.'});
  }
  try {
    return res.status(200).json(DB.lists.put(req.params.id, name));
  } catch (error) {
    res.status(404).json({ message: `Can not update list. ${error.message}`})
  }
});
router.get('/api/lists/:id/items/:itemId', (req, res) => {
  try {
    return res.status(200).json(DB.items.get(req.params.id, req.params.itemId));
  } catch (error) {
    return res.status(404).json({ message: error.message});
  }
});
router.get('/api/lists/:id/items', (req, res) => {
  try {
    return res.status(200).json(DB.items.get(req.params.id));
  } catch (error) {
    return res.status(404).json({ message: error.message});
  }
});
router.post('/api/lists/:id/items', (req, res) => {
  const { itemId, type } = req.body;
  if (!itemId || !type) {
    return res.status(400).json({ message: 'missing property on item object'});
  }
  try {
    return res.status(200).json(DB.items.post(req.params.id, itemId, type));
  } catch (error) {
    return res.status(404).json({ message: `can not create. ${error.message}` });
  }
});
router.delete('/api/lists/:id/items/:itemId', (req, res) => {
  try {
    return res.status(200).json(DB.items.delete(req.params.id, req.params.itemId));
  } catch (error) {
    return res.status(404).json({ message: error.message});
  }
});

module.exports = router;
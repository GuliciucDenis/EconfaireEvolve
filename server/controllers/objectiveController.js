const objectiveService = require('../services/objectiveService');

const getAllObjectives = async (req, res) => {
    try {
        const objectives = await objectiveService.getAllObjectives();
        res.status(200).json({ message: 'All current objectives', objectives });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getObjectiveById = async (req, res) => {
    try {
        const objective = await objectiveService.getObjectiveById(req.params.id);
        if (!objective) {
            return res.status(404).json({ message: 'Objective not found' });
        }
        res.status(200).json({ message: 'Objective found', objective });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createObjective = async (req, res) => {
    try {
        const objectiveData = req.body;
        const objective = await objectiveService.createObjective(objectiveData);
        res.status(201).json({ message: 'Objective created', objective });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateObjectiveById = async (req, res) => {
    try {
        const updateData = req.body;
        const objective = await objectiveService.updateObjectiveById(req.params.id, updateData);
        if (!objective) {
            return res.status(404).json({ message: 'Objective not found' });
        }
        res.status(200).json({ message: 'Objective updated', objective });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteObjectiveById = async (req, res) => {
    try {
        const objective = await objectiveService.deleteObjectiveById(req.params.id);
        if (!objective) {
            return res.status(404).json({ message: 'Objective not found' });
        }
        res.status(200).json({ message: 'Objective deleted', objective });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllObjectives,
    getObjectiveById,
    createObjective,
    updateObjectiveById,
    deleteObjectiveById
};

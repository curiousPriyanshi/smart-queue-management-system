const Counter = require("../models/Counter");

const createCounter = async (req, res) => {
    try {
        const { name, queueID } = req.body;
        const newCounter = new Counter({ name, queueID, assignedAdmin: req.user.id });
        await newCounter.save();
        res.status(201).json({ success: true, message: "Counter created successfully", counter: newCounter });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const updateCounter = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, queueID, assignedAdmin } = req.body;
        const counter = await Counter.findByIdAndUpdate(id, { name, queueID, assignedAdmin }, { new: true });
        if (!counter) {
            return res.status(404).json({ success: false, message: "Counter not found" });
        }
        res.status(200).json({ success: true, message: "Counter updated successfully", counter });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const toggleCounter = async (req, res) => {
    try {
        const { id } = req.params;
        const counter = await Counter.findById(id);
        if (!counter) {
            return res.status(404).json({ success: false, message: "Counter not found" });
        }
        counter.isActive = !counter.isActive;
        await counter.save();
        res.status(200).json({ success: true, message: `Counter ${counter.isActive ? 'activated' : 'deactivated'} successfully` });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const getAllCounters = async (req, res) => {
    try {
        const counters = await Counter.find().populate('queueID', 'name').populate('assignedAdmin', 'name');
        res.status(200).json({ success: true, counters });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const getCounter = async (req, res) => {
    try {
        const { id } = req.params;
        const counter = await Counter.findById(id).populate('queueID', 'name').populate('assignedAdmin', 'name');
        if (!counter) {
            return res.status(404).json({ success: false, message: "Counter not found" });
        }
        res.status(200).json({ success: true, counter });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
module.exports = { createCounter, updateCounter, toggleCounter, getAllCounters, getCounter };
import moment from "moment";

class NurseController {
    constructor(service) {
        this.service = service
    }

    getAll = async (req, res) => {
        try {
            const { 
                sortBy = "name", 
                order = "ASC",
                search = "",
                name = "",
                licenseNumber = "",
                ageMin = "",
                ageMax = "",
                dobFrom = "",
                dobTo = "" 
            } = req.query;

            // Build filters object
            const filters = {};
            if (name) filters.name = name;
            if (licenseNumber) filters.licenseNumber = licenseNumber;
            if (ageMin) filters.ageMin = ageMin;
            if (ageMax) filters.ageMax = ageMax;
            if (dobFrom) filters.dobFrom = dobFrom;
            if (dobTo) filters.dobTo = dobTo;

            const nurses = await this.service.getAll(sortBy, order, search, filters);
            res.json(nurses);
        } catch (error) {
            console.error('Error in getAll:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    create = async (req, res) => {
        try {
            let { dob } = req.body;
            dob = moment(dob, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
            req.body.dob = dob;
            const nurse = await this.service.create(req.body);
            res.status(201).json(nurse);
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    update = async (req, res) => {
        try {
            const nurse = await this.service.update(req.params.id, req.body)
            res.json(nurse)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    delete = async (req, res) => {
        try {
            const nurse = await this.service.delete(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    getById = async (req, res) => {
        try {
            const nurse = await this.service.getById(req.params.id);
            if (!nurse) {
                res.status(404).json({ error: "Nurse not found" });
            } else {
                res.json(nurse)
            }
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

export default NurseController;

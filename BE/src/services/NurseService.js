import { Op } from 'sequelize'; 

class NurseService {
    constructor(NurseModel) {
        this.NurseModel = NurseModel
    }

    async getAll(sortBy = "id", order = "ASC", search = "", filters = {}) {
        const whereClause = {};
        const conditions = [];

        // Search functionality - searches across multiple fields
        if (search && search.trim()) {
            conditions.push({
                [Op.or]: [
                    { name: { [Op.like]: `%${search.trim()}%` } },
                    { licenseNumber: { [Op.like]: `%${search.trim()}%` } },
                ]
            });
        }

        // Individual filter functionality
        if (filters.name && filters.name.trim()) {
            conditions.push({ name: { [Op.like]: `%${filters.name.trim()}%` } });
        }
        
        if (filters.licenseNumber && filters.licenseNumber.trim()) {
            conditions.push({ licenseNumber: { [Op.like]: `%${filters.licenseNumber.trim()}%` } });
        }
        
        // Age range filter
        if (filters.ageMin || filters.ageMax) {
            const ageCondition = {};
            if (filters.ageMin && !isNaN(filters.ageMin)) {
                ageCondition[Op.gte] = parseInt(filters.ageMin);
            }
            if (filters.ageMax && !isNaN(filters.ageMax)) {
                ageCondition[Op.lte] = parseInt(filters.ageMax);
            }
            if (Object.keys(ageCondition).length > 0) {
                conditions.push({ age: ageCondition });
            }
        }
        
        // Date range filter
        if (filters.dobFrom || filters.dobTo) {
            const dobCondition = {};
            if (filters.dobFrom) dobCondition[Op.gte] = filters.dobFrom;
            if (filters.dobTo) dobCondition[Op.lte] = filters.dobTo;
            conditions.push({ dob: dobCondition });
        }

        // Combine all conditions with AND
        if (conditions.length > 0) {
            whereClause[Op.and] = conditions;
        }

        // Validate sortBy 
        const allowedSortFields = ['id', 'name', 'licenseNumber', 'dob', 'age'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
        const validOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        try {
            return await this.NurseModel.findAll({
                where: whereClause,
                order: [[validSortBy, validOrder]]
            });
        } catch (error) {
            console.error('Database query error:', error);
            throw new Error('Failed to fetch nurses');
        }
    }

    async create(nurseData) {
        return await this.NurseModel.create(nurseData)
    }

    async update(id, nurseData) {
        await this.NurseModel.update(nurseData, { where: { id } })
        return await this.NurseModel.findByPk(id)
    }

    async delete(id) {
        return await this.NurseModel.destroy({ where: { id } })
    }

    async getById(id) {
        return await this.NurseModel.findByPk(id)
    }
}

export default NurseService;

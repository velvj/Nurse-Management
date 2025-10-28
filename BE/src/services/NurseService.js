class NurseService {
    constructor(NurseModel) {
        this.NurseModel = NurseModel
    }
    async getAll(sortBy = "name", order = "ASC") {
        return await this.NurseModel.findAll({ order: [[sortBy, order.toUpperCase()]] })
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

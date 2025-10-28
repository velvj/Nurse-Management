import moment from "moment";

class NurseController {
    constructor(service) {
        this.service = service
    }

    getAll = async (req, res) => {
        const { sortBy = "name", order = "ASC" } = req.query;
        const nurses = await this.service.getAll(sortBy, order)
        res.json(nurses)
    }
    create = async (req, res) => {
        console.log("inside nurse controller create method");
        console.log("Received DOB:", req.body);
        try {
            let {dob}=req.body;
            dob = moment(dob,["DD-MM-YYYY","YYYY-MM-DD"]).format("YYYY-MM-DD");
            req.body.dob=dob;
            console.log("Formatted DOB:", dob);
            const nurse = await this.service.create(req.body);
            res.status(201).json(nurse);
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    update = async (req,res)=>{
        try{
const nurse =await this.service.update(req.params.id,req.body)
res.json(nurse)
        }catch(err){
res.status(400).json({error:err.message})
        }
    }
    delete = async (req,res)=>{
        const nurse = await this.service.delete(req.params.id);
        res.status(204).end();
    }

    getById = async (req,res)=>{
        const nurse = await this.service.getById(req.params.id);
        if(!nurse){
            res.status(404).json({error:"Nurse not found"});

        }else{
            res.json(nurse)
        }
    }
}

export default NurseController;
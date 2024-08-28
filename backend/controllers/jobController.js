const Job = require('../models/jobs')

const newJob = async(req,res)=>{
  try{
    const {company,role,description,link} = req.body ;

    if(!company || !role || !link){
      return res.status(404).json({message:'missing fields'}) ;
    }

    const job = new Job({company,role,description,link})
    await job.save() ;
    return res.status(201).json({ message: 'Job created successfully', job });

  }catch(error){
    console.log(error) ;
  }
}

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find(); 
    return res.status(200).json(jobs);
  } catch (error) {
    console.error('Error getting jobs:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {newJob,getAllJobs} ;
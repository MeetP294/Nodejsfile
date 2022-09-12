export default (req,res)=>{
    let data=req.body
    res.status(200).json({ name1: data });
}
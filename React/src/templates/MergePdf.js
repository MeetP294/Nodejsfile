export default function MergePdf(req, res) {
    var data=req.body
    res.status(200).json({ name: 'John Doe',lastname:data })
  }
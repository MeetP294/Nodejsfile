export default function MergePdf2(req, res) {
    var data=req.body
    if(req.method=="POST"){
        res.status(200).json({ name: 'John Doe',lastname:data })

    }
    else{
        res.status(200).json({ name: 'John Doe' })

    }
  }
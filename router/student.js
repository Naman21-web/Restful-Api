const express = require("express");
const router = new express.Router();

router.get("/naman",(req,res) =>{
    res.send("Hello whatsup guys")
})

module.exports = router;
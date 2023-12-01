const {sendLineMessage } = require('./utils/sendLineMessage')
const dotenv = require('dotenv')
const express = require('express')
const app = express()
dotenv.config();
app.use(express.json())


app.get('/', (req, res) => {
    res.json({
        message: 'Success'
    })
})

app.get('/line/webhook', (req, res) => {
    res.status(200).json({
        message: 'webhook'
    })
})

app.post('/line/webhook', async (req, res) => {
    try {
        let messages;

        const userText = req.body.events[0].message.text
        const { groupId, userId } = req.body.events[0].source
        const replyToken = req.body.events[0].replyToken


        if (userId !== process.env.USER_ID) {
            throw { message: 'Not alllowed!'}
        }

        messages = [
            {
                "type": "text",
                "text": "บันทึกข้อมูลเรียบร้อย"
            }
        ]
        
        const replyMessage =  {
            replyToken,
            messages: 'กรุณากรอกใหม่อีกครั้ง'
        }
        // await checkMessages('tset')
        await sendLineMessage('https://api.line.me/v2/bot/message/reply', replyMessage, userText)

        res.json({
            status: 'ok'
        })


    } catch(err) {
        return res.json({
            message: 'Something went wrong!'
        })
    }
})

const port = 3000
app.listen(3000, () => {
    console.log(`App is running at http://localhost:${port}`)
})
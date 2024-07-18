const { listSenror } = require("../model/sensor");
const axios = require("axios");

const { ONE_SIGNAL_CONFIG } = require("../../notif");

const db = require("../../firebase");
const {
  collection,
  query,
  addDoc,
  getDocs,
  orderBy,
  limit,
} = require("firebase/firestore");

const createNotif = async (lantai, ruangan) => {
  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: ONE_SIGNAL_CONFIG.APP_ID,
        headings: { en: "Terdapat Bahaya" },
        contents: {
          en: `Bahaya di lantai ${lantai}, ruangan ${ruangan}`,
        },
        included_segments: ["All"],
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${ONE_SIGNAL_CONFIG.API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error sending notification:",
      error.response ? error.response.data : error.message
    );
  }
};

const createSensor = async (req, res) => {
  try {
    const { lantai, ruangan } = req.body;

    const sensorCollection = collection(db, "riwayat");
    const sensorQuery = query(
      sensorCollection,
      orderBy("id", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(sensorQuery);

    let newId = 1;
    if (!querySnapshot.empty) {
      const lastDoc = querySnapshot.docs[0];
      newId = lastDoc.data().id + 1;
    }

    const newSensorData = {
      id: newId,
      lantai,
      ruangan,
      timestamp: new Date().toISOString(),
    };

    await addDoc(sensorCollection, newSensorData);

    await createNotif(lantai, ruangan);

    res.status(200).json({ msg: "Sukses buat notif", data: newSensorData });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createSensor,
};

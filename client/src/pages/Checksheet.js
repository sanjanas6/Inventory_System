import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box
} from "@mui/material";

import API from "../services/api";

function Checksheet() {
  const { id } = useParams();

  const [entry, setEntry] = useState(null);

  const [form, setForm] = useState({});

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // ================= CHECKLIST CONSTANT =================

  const checklistMap = {
    1: {
      label: "वाहन से इग्निशन चाबी निकालना सुनिश्चित करें",
      category: "सुरक्षा"
    },
    2: {
      label: "गाड़ी में व्हील चौक का इस्तेमाल सुनिश्चित करें",
      category: "सुरक्षा"
    },
    3: {
      label: "गाड़ी के नीचे काम करने से पहले हेलमेट का इस्तेमाल करें",
      category: "सुरक्षा"
    },
    4: {
      label: "किसी भी असामान्य ध्वनि की जाँच करें",
      category: "सुरक्षा"
    },

    5: {
      label: "इंजन ऑयल स्तर / लीकेज",
      category: "इंजन"
    },
    6: {
      label: "रेडिएटर में कूलेंट स्तर / लीकेज / कैप की हालत",
      category: "इंजन"
    },
    7: {
      label: "एयर फ़िल्टर की हालत",
      category: "इंजन"
    },
    8: {
      label: "इंजन फैन बेल्ट की हालत",
      category: "इंजन"
    },
    9: {
      label: "अल्टरनेटर बेल्ट की हालत",
      category: "इंजन"
    },

    10: {
      label: "सिस्टम में कहीं लीक तो ना हो",
      category: "फ्यूल सिस्टम"
    },
    11: {
      label: "जरुरत हो तो फ्यूल फिल्टर बदलें",
      category: "फ्यूल सिस्टम"
    },
    12: {
      label: "वॉटर सेपरेटर से पानी निकालना / ऑटो ड्रेन सिस्टम की जांच",
      category: "फ्यूल सिस्टम"
    },

    13: {
      label: "क्लच ऑयल स्तर / लीकेज / सीपेज",
      category: "क्लच"
    },
    14: {
      label: "क्लच वियर सूचक इंडीकेटर की जांच",
      category: "क्लच"
    },

    15: {
      label: "गियर बॉक्स ऑयल स्तर / लीकेज / सीपेज",
      category: "गियर बॉक्स"
    },

    16: {
      label: "व्हील हब ग्रीसिंग समय अनुसार",
      category: "व्हील हब"
    },
    17: {
      label: "व्हील एलाइनमेंट शेड्यूल की जांच करें",
      category: "व्हील हब"
    },

    18: {
      label: "एयर लीकेज जांच",
      category: "ब्रेक"
    },
    19: {
      label: "ब्रेक पैडल प्ले जांचें और एडजस्ट करें",
      category: "ब्रेक"
    },
    20: {
      label: "एयर टैंकों से कंडेंस्ड पानी निकालें",
      category: "ब्रेक"
    },

    21: {
      label: "स्टीयरिंग गियर बॉक्स ऑयल स्तर (जरूरत हो तो टॉप अप करो)",
      category: "स्टीयरिंग (मेकैनिकल)"
    },

    22: {
      label: "बैटरी माउंटिंग / टर्मिनल / केबल फंसाव की जांच",
      category: "इलेक्ट्रिकल्स"
    },
    23: {
      label: "सारे फ्यूज चेक करो और बिजली की तारों में छेड़छाड़ देखो",
      category: "इलेक्ट्रिकल्स"
    },
    24: {
      label: "वाइपर मोटर, वाइपर ब्लेड, विंडशील्ड वॉशर की हालत देखो",
      category: "इलेक्ट्रिकल्स"
    },
    25: {
      label: "वायरिंग हार्नेस मार्ग, माउंटिंग, क्लैंप की जांच",
      category: "इलेक्ट्रिकल्स"
    },
    26: {
      label: "वायरिंग हार्नेस का चैसिस, केबिन बॉडी के साथ टच की जांच",
      category: "इलेक्ट्रिकल्स"
    },

    27: {
      label: "डीईएफ टैंक में स्तर जांचो",
      category: "SCR"
    },
    28: {
      label: "इमिशन सिस्टम (देखकर जांच)",
      category: "SCR"
    },
    29: {
      label: "डायग्नोस्टिक टूल लगाकर एरर जांचो",
      category: "SCR"
    },

    30: {
      label: "CNG लीकेज",
      category: "CNG"
    }
  };

  // ================= GROUPED DATA =================

  const groupedChecklist = useMemo(() => {
    return Object.entries(checklistMap).reduce((acc, [id, item]) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }

      acc[item.category].push({
        id: Number(id),
        ...item
      });

      return acc;
    }, {});
  }, []);

  // ================= API =================

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await API.get(`/entries/${id}`);

      setEntry(res.data);

      if (res.data.checklist?.length > 0) {
        const formattedData = {};

        res.data.checklist.forEach((item) => {
          formattedData[item.itemId] = {
            before: item.before || "",
            after: item.after || ""
          };
        });

        setForm(formattedData);
      }
    } catch (err) {
      console.log(err);

      setToast({
        open: true,
        message: "Failed to load checksheet ❌",
        severity: "error"
      });
    }
  };

  // ================= FORM HANDLER =================

  const handleChange = (id, type, value) => {
    setForm((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: value
      }
    }));
  };

  // ================= SAVE =================

  const save = async () => {
    try {
      const checklistArray = Object.keys(checklistMap).map((key) => ({
        itemId: Number(key),
        label: checklistMap[key].label,
        category: checklistMap[key].category,
        before: form[key]?.before || "",
        after: form[key]?.after || ""
      }));

      await API.put(`/entries/${id}`, {
        checklist: checklistArray,
        status: "JOBCARD"
      });

      setToast({
        open: true,
        message: "Checksheet saved successfully ✅",
        severity: "success"
      });
    } catch (err) {
      console.log(err);

      setToast({
        open: true,
        message: "Error saving data ❌",
        severity: "error"
      });
    }
  };

  // ================= LOADER =================

  if (!entry) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= COMMON ROW =================

  const renderChecklistRow = (id, label) => (
    <TableRow key={id}>
      <TableCell width={60}>{id}</TableCell>

      <TableCell>{label}</TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={form[id]?.before || ""}
          onChange={(e) =>
            handleChange(id, "before", e.target.value)
          }
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={form[id]?.after || ""}
          onChange={(e) =>
            handleChange(id, "after", e.target.value)
          }
        />
      </TableCell>
    </TableRow>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>

        {/* ================= HEADER ================= */}

        <Typography align="center" fontWeight="bold" fontSize={22}>
          S.S. MOTORS
        </Typography>

        <Typography align="center">
          COMMERCIAL VEHICLE DIVISION (TASS)
        </Typography>

        <Typography align="center">
          MHOW-NEEMUCH ROAD, BHAWRASA SANDA
        </Typography>

        {/* ================= VEHICLE DETAILS ================= */}

        <Table border={1} sx={{ mt: 3 }}>
          <TableBody>

            <TableRow>
              <TableCell>रजिस्ट्रेशन नंबर</TableCell>
              <TableCell>{entry.vehicleNo}</TableCell>

              <TableCell>वाहन मॉडल</TableCell>
              <TableCell>{entry.model}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>चेसिस नंबर</TableCell>
              <TableCell>{entry.chassisNo}</TableCell>

              <TableCell>दिनांक</TableCell>
              <TableCell>{entry.date}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>ग्राहक नाम</TableCell>
              <TableCell>{entry.customerName}</TableCell>

              <TableCell>मोबाइल</TableCell>
              <TableCell>{entry.mobileNo}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>किलोमीटर</TableCell>
              <TableCell>{entry.kilometer}</TableCell>

              <TableCell />
              <TableCell />
            </TableRow>

          </TableBody>
        </Table>

        {/* ================= CHECKLIST ================= */}

        <Table border={1} sx={{ mt: 3 }}>
          <TableBody>

            <TableRow sx={{ background: "#f5f5f5" }}>
              <TableCell>#</TableCell>
              <TableCell>चेकलिस्ट</TableCell>
              <TableCell>जांच से पूर्व</TableCell>
              <TableCell>जांच के बाद</TableCell>
            </TableRow>

            {Object.entries(groupedChecklist).map(
              ([category, items]) => (
                <>

                  <TableRow key={category}>
                    <TableCell colSpan={4}>
                      <b>{category}</b>
                    </TableCell>
                  </TableRow>

                  {items.map((item) =>
                    renderChecklistRow(item.id, item.label)
                  )}

                </>
              )
            )}

          </TableBody>
        </Table>

        {/* ================= CUSTOMER FEEDBACK ================= */}

        <Typography sx={{ mt: 3 }}>
          ग्राहक फीडबैक:
          &nbsp;&nbsp;1. इंजन माइलेज
          &nbsp;&nbsp;2. टायर लाइफ
        </Typography>

        {/* ================= COMPLAINT TABLE ================= */}

        <Table border={1} sx={{ mt: 3 }}>
          <TableBody>

            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>ग्राहक शिकायत</TableCell>
              <TableCell>शुरुआत</TableCell>
              <TableCell>समाप्ति</TableCell>
              <TableCell>तकनीशियन</TableCell>
            </TableRow>

            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <TableRow key={i}>
                <TableCell>{i}</TableCell>

                <TableCell>
                  <TextField fullWidth size="small" />
                </TableCell>

                <TableCell>
                  <TextField size="small" />
                </TableCell>

                <TableCell>
                  <TextField size="small" />
                </TableCell>

                <TableCell>
                  <TextField size="small" />
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>

        {/* ================= QUALITY ================= */}

        <Typography sx={{ mt: 3, mb: 1 }}>
          <b>गुणवत्ता जांच</b>
        </Typography>

        <Table border={1}>
          <TableBody>

            {[
              "इंजन ऑयल",
              "गियर ऑयल",
              "डिफरेंशियल",
              "बैटरी",
              "कूलेंट"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item}</TableCell>

                <TableCell>
                  <TextField fullWidth size="small" />
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>

        {/* ================= LOCATION ================= */}

        <Table border={1} sx={{ mt: 3 }}>
          <TableBody>

            <TableRow>
              <TableCell>लोकेशन</TableCell>
              <TableCell>मैकेनिक</TableCell>
              <TableCell>हेल्पर</TableCell>
            </TableRow>

            {[
              "बायीं साइड",
              "दायीं साइड",
              "केबिन",
              "नीचे",
              "फ्रंट",
              "रियर"
            ].map((location, index) => (
              <TableRow key={index}>
                <TableCell>{location}</TableCell>

                <TableCell>
                  <TextField fullWidth size="small" />
                </TableCell>

                <TableCell>
                  <TextField fullWidth size="small" />
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>

        {/* ================= TOOLS ================= */}

        <Typography sx={{ mt: 3 }}>
          आवश्यक बेसिक टूल:
          मल्टी मीटर, टॉर्क रिंच, हाइड्रो मीटर
        </Typography>

        {/* ================= SAVE BUTTON ================= */}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={save}
        >
          Save
        </Button>

      </Paper>

      {/* ================= TOAST ================= */}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Checksheet;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Grid,
    Chip,
    Button
} from "@mui/material";
import API from "../services/api";

function PartsView() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [entry, setEntry] = useState(null);

    useEffect(() => {
        fetchEntry();
    }, []);

    const fetchEntry = async () => {
        const res = await API.get(`/entries/${id}`);
        setEntry(res.data);
    };

    // SAFE CHECK
    const hasEstimate =
        entry?.estimate &&
        Object.keys(entry.estimate).length > 0 &&
        entry.estimate.total;

    if (!entry) return "Loading...";

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3 }}>

                <Typography variant="h6">
                    Vehicle: {entry.vehicleNo}
                </Typography>

                <Typography sx={{ mb: 2 }}>
                    Customer: {entry.customerName}
                </Typography>

                {/* PARTS LIST */}
                {entry.partsDetails?.map((p, i) => (
                    <Grid container spacing={2} key={i} sx={{ mb: 2 }}>

                        <Grid item xs={4}>
                            <Typography><b>{p.partName}</b></Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography>Qty: {p.quantity}</Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Chip
                                label={p.status}
                                color={p.status === "AVAILABLE" ? "success" : "warning"}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <Typography>
                                {p.status === "NOT_AVAILABLE"
                                    ? `ETA: ${p.eta || "-"}`
                                    : "-"}
                            </Typography>
                        </Grid>

                    </Grid>
                ))}

                {/* GIVE ESTIMATE */}
                {!hasEstimate && entry.status === "PARTS_DONE" && (
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/estimate/${id}`)}
                    >
                        Give Estimate
                    </Button>
                )}

                {/* VIEW ESTIMATE */}
                {hasEstimate && (
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/estimate-view/${id}`)}
                    >
                        View Estimate
                    </Button>
                )}

            </Paper>
        </Container>
    );
}

export default PartsView;
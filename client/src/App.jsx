import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api";
import {
  AppBar,
  Toolbar,
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function App({ mode, setMode }) {
  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");

  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
    select: (data) => data ?? [],
  });

  const addTodo = useMutation({
    mutationFn: createTodo,
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });

  const completeTodo = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });

  const removeTodo = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    addTodo.mutate({ body: newTodo.trim(), completed: false });
    setNewTodo("");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Go + React Todo List Demo
          </Typography>
          <IconButton color="inherit" onClick={toggleMode}>
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardHeader
          title="Tasks"
          sx={{ textAlign: "center", bgcolor: "primary.main", color: "white" }}
        />
        <CardContent>
          {/* Input + Add button */}
          <Grid container spacing={2} mb={2} justifyContent="center" alignItems="stretch">
            <Grid item xs={9}>
              <TextField
                fullWidth
                label="Add New Task"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAdd}
                sx={{ height: '100%' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          {/* Loading / Error */}
          {isLoading && <Typography>Loading...</Typography>}
          {error && (
            <Typography color="error">Error loading todos</Typography>
          )}

          {/* Todos or Empty State */}
          {!isLoading && !error && (
            todos.length > 0 ? (
              <List>
                {todos.map((todo) => (
                  <ListItem
                    key={todo._id}
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          color="success"
                          onClick={() => completeTodo.mutate(todo._id)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => removeTodo.mutate(todo._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={todo.body}
                      sx={{
                        textDecoration: todo.completed ? "line-through" : "none",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
                No todos yet — add one above!
              </Paper>
            )
          )}
        </CardContent>
      </Card>
    </Container>
    </>
  );
}

export default App;

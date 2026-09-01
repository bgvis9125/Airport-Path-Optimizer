# Airport Path Optimizer - Prim's Algorithm

A graph-based optimization project that uses **Prim's Minimum Spanning Tree (MST) algorithm** to find the most efficient airport network connections with minimum total cost.

## 🎯 Project Overview

**Airport Path Optimizer** models airports as nodes and flight routes as weighted edges (distance, fuel cost, flight time) to create the optimal connectivity network using Prim's greedy algorithm.

**Perfect for:**
- Data Structures & Algorithms coursework
- Aviation network optimization 
- Network infrastructure planning

## 🔬 Existing Approaches & Project Contribution

| Existing Approach                    | Limitation / Challenge                                                                                   | Airport Path Optimizer's Contribution                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Graph-based network modelling**    | Graph structures can be difficult to understand when represented only through abstract data structures.  | Converts the graph into an **interactive visual airport network**.                      |
| **Minimum Spanning Tree algorithms** | Algorithms such as Prim's are often demonstrated using static examples or console-based implementations. | Provides **live visual rendering** of the generated Minimum Spanning Tree.              |
| **Static algorithm demonstrations**  | Users cannot easily observe how the algorithm transforms the network.                                    | Makes the optimization process visually interpretable through an interactive interface. |
| **Manual route/network analysis**    | Increasing network complexity makes manual reasoning difficult.                                          | Reduces the network optimization problem to a structured **weighted-graph problem**.    |

### 💡 What Differentiates the Project

The project bridges the gap between **algorithmic theory and interactive visualization**, turning Prim's Minimum Spanning Tree algorithm into a visual optimization tool for airport network modelling.


## ✨ Features

- Prim's MST algorithm implementation from scratch
- Weighted undirected graph representation
- Minimum cost airport connectivity
- Path analysis between airport pairs
- Network visualization support
- Custom airport connection input

**Prim's Algorithm Steps:**
1. Start from any airport (arbitrary node)
2. Add lowest-cost edge connecting visited ↔ unvisited airports
3. Repeat until all airports connected

## 🌐 Real-World Applications

- **Airline Route Planning**: Connect all destinations with min cost
- **Air Traffic Management**: Optimal airspace routing
- **Regional Airports**: Minimum infrastructure investment
- **Communication Networks**: Airport-to-airport connectivity

## 🔮 Future Enhancements

- Capacity constraints (runway slots)
- Multi-objective optimization (cost+time+noise)
- Real-time weather/fuel price updates
- Interactive GUI with maps
- FAA real airport dataset integration
- Kruskal's algorithm comparison

## 🤝 Contribute & Collaborate

Have an idea for a better optimization strategy or visualization? Feel free to contribute through an issue or pull request, or connect with me on [LinkedIn](https://www.linkedin.com/in/bhargavi-singh-671745286/) to collaborate.

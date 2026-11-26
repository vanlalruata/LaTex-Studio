# 7. Academic Diagram Makers

The product should include specialized makers built on the same scene graph and TikZ generator. They are guided editors, not separate unrelated drawing engines.

## 7.1 Flowchart maker
- Start/end, process, decision, input/output, document, database.
- Connector routing.
- Branch labels.
- Yes/no labels.
- Swimlanes.
- Auto-layout.
- Theme presets.

## 7.2 System architecture maker
- Components, services, databases, devices, clouds, boundaries.
- Ports and connectors.
- Protocol labels.
- Group/container nodes.
- Deployment zones.
- Layered architecture layouts.

## 7.3 Neural network / deep learning maker
- Input/output layers.
- Dense, convolutional, pooling, recurrent, attention blocks.
- CNN, RNN, LSTM, GRU, Transformer components.
- Feature maps and tensor dimensions.
- Skip/residual connections.
- Attention arrows.
- Layer labels and legends.
- Architecture templates.
- Generate standard TikZ nodes and edges.

## 7.4 Machine learning workflow maker
- Dataset, preprocessing, feature extraction, training, validation, testing, evaluation.
- Branches and feedback loops.
- Metrics and model blocks.
- Pipeline templates.

## 7.5 Algorithm and pseudocode diagrams
- Algorithm blocks.
- Decision trees.
- Loop/iteration structures.
- Input/output.
- Complexity annotations.
- Flow connections.

## 7.6 Graph theory maker
- Directed/undirected graphs.
- Weighted graphs.
- Vertices and edges.
- Labels and edge weights.
- Trees and spanning trees.
- Bipartite graphs.
- Network layouts.
- Graph coloring.
- Adjacency/matrix annotations.

## 7.7 Mathematical diagrams
- Number lines.
- Coordinate systems.
- Function graphs (basic).
- Geometric constructions.
- Vectors.
- Angles and arcs.
- Set diagrams.
- Venn diagrams.
- Commutative diagrams in a later module.
- Probability trees.

## 7.8 Scientific plots
A dedicated PGFPlots maker should be a later specialized module:
- line, scatter, bar, histogram, box plot, heatmap where supported.
- axes, ticks, legends, labels, grid.
- data import from CSV.
- error bars and confidence intervals.
- axis scaling and units.
Do not overload the general TikZ editor with all plot configuration.

## 7.9 Timeline and process diagrams
- Timeline nodes.
- Milestones.
- Horizontal/vertical process layouts.
- Swimlanes and phases.
- Gantt-like visual structures (specialized later).

## 7.10 Maker templates
Provide templates for:
- CNN architecture.
- CNN-BiLSTM.
- Attention mechanism.
- Transformer encoder.
- IoT network architecture.
- Intrusion detection pipeline.
- Dataset preprocessing workflow.
- Experimental methodology.
- Research framework.
- System architecture.
- Flowchart.
- Decision tree.
- Graph/network.
- Mathematical coordinate diagram.

Templates must be editable and generate inspectable TikZ source.

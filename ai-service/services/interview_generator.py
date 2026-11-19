import concurrent.futures
from typing import Dict, List, Any
from services.skill_extractor import extract_skills

DIFFICULTY_MODIFIERS = {
    "Easy": "fundamental concepts, core definitions, and basic syntax",
    "Medium": "real-world trade-offs, architecture decisions, and debugging scenarios",
    "Hard": "distributed scale, low-level optimization, fault tolerance, and concurrency"
}

def generate_curated_interview_questions(
    role: str = "Software Engineer",
    skills: List[str] = None,
    difficulty: str = "Medium",
    projects: List[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Curated dynamic interview preparation generator covering:
    - Technical
    - Project
    - DSA
    - ML
    - Behavioral
    - HR
    With comprehensive talking points / answers for each question tailored to candidate's real skills & projects.
    """
    skills = skills or ["Python", "SQL", "Git"]
    top_skill = skills[0] if skills else "Python"
    second_skill = skills[1] if len(skills) > 1 else "SQL"
    third_skill = skills[2] if len(skills) > 2 else "Git"

    first_project = projects[0] if projects and len(projects) > 0 else None
    proj_title = first_project.get("title", "Full-Stack System") if first_project else "Primary Technical Project"
    proj_techs = ", ".join(first_project.get("technologies", [top_skill, second_skill])[:3]) if first_project else f"{top_skill} and {second_skill}"

    # Technical Questions by Difficulty
    if difficulty == "Easy":
        tech_q1 = f"What are the core foundational principles and built-in data types in {top_skill}?"
        tech_a1 = (
            f"In {top_skill}, explain primitive types vs composite structures, mutable vs immutable constructs, "
            f"and scope rules. Highlight type checking, standard error handling blocks (try/except or try/catch), and idioms for clean code."
        )
        tech_q2 = f"How do basic queries, filtering (WHERE clauses), and primary keys work in {second_skill}?"
        tech_a2 = (
            f"In {second_skill}, describe table creation, unique constraints, and filtering rows. "
            "Explain the difference between clustered and non-clustered primary keys and how foreign key relations preserve referential integrity."
        )
    elif difficulty == "Hard":
        tech_q1 = f"How do you diagnose and resolve memory leaks, GIL contention, or low-level concurrency locks in {top_skill} at high throughput?"
        tech_a1 = (
            f"Deep-dive into {top_skill} internals: object reference cycles, garbage collector thresholds, async event loops vs multi-processing workers, "
            "and memory profiling using heap dumps. Discuss lock-free data structures and offloading CPU-bound tasks."
        )
        tech_q2 = f"How do you design database partitioning, replication topologies, and distributed query sharding in {second_skill} under write-heavy loads?"
        tech_a2 = (
            "Detail horizontal sharding strategies, range vs hash partitioning, read/write replica routing, WAL (Write-Ahead Logging) tuning, "
            "and resolving distributed transaction consistency trade-offs (two-phase commit vs Saga patterns)."
        )
    else:  # Medium (Default)
        tech_q1 = f"How do you manage performance and memory optimization when developing production services with {top_skill}?"
        tech_a1 = (
            f"When working in {top_skill}, profile bottlenecks before premature optimization. "
            "Leverage appropriate data structures with O(1) or O(log N) lookups, minimize redundant I/O, "
            "and apply caching strategies (e.g., Redis or in-memory LRU cache) for expensive computational operations."
        )
        tech_q2 = f"How do you design database schema relationships, composite indexes, and query plans in {second_skill} for heavy read workloads?"
        tech_a2 = (
            "Identify high-frequency query filters and join keys to create composite B-tree indexes. "
            "Avoid indexing low-cardinality columns. For heavy read workloads, examine query plans (EXPLAIN ANALYZE) and avoid N+1 query antipatterns."
        )

    # Project Questions
    if difficulty == "Easy":
        proj_q1 = f"Can you explain the main goal of your project '{proj_title}' and what tools you used?"
        proj_a1 = (
            f"State the problem '{proj_title}' solved, why {proj_techs} were chosen, "
            "and describe your individual contribution in implementing core features."
        )
        proj_q2 = f"How did you test and verify that '{proj_title}' worked as intended?"
        proj_a2 = "Describe unit testing, writing test cases for edge scenarios, manual validation, and how you verified API outputs."
    elif difficulty == "Hard":
        proj_q1 = f"In '{proj_title}', what were the most severe latency or scaling bottlenecks, and how did you re-architect the system to overcome them?"
        proj_a1 = (
            f"Discuss telemetry metrics (P95/P99 latency, CPU utilization), how you identified the bottleneck in {proj_techs}, "
            "and implemented solutions like asynchronous job queues, connection pooling, indexing, or streaming pipelines."
        )
        proj_q2 = f"If '{proj_title}' had to handle a 100x surge in concurrent requests, how would you redesign the architecture?"
        proj_a2 = (
            "Detail horizontal scaling with load balancers, database read-replicas and sharding, multi-tier caching (Redis/CDN), "
            "asynchronous messaging (Kafka/RabbitMQ), and circuit breakers for resilience."
        )
    else:  # Medium
        proj_q1 = f"Walk me through the architecture of '{proj_title}'. Why did you choose {proj_techs} over alternative technologies?"
        proj_a1 = (
            "Structure using the STAR framework: 1) The technical requirements, 2) Architecture tiers (Client UI, API Gateway, Services, DB), "
            f"3) Rationale for selecting {proj_techs} (performance, ecosystem maturity), and 4) Challenges overcome during implementation."
        )
        proj_q2 = f"What was the most challenging technical bug or edge case encountered in '{proj_title}', and how did you diagnose and resolve it?"
        proj_a2 = (
            "Describe a concrete issue (e.g. race condition, serialization bug, unhandled exception, or connection timeout). "
            "Explain your systematic diagnostic process: log analysis, reproducible tests, root-cause isolation, and regression verification."
        )

    # DSA Questions by Difficulty
    if difficulty == "Easy":
        dsa_q1 = "How does a Hash Map work, and why does it provide average O(1) time complexity for insertions and lookups?"
        dsa_a1 = (
            "Hash maps apply a hash function to map keys to bucket array indices. In average cases, array indexing is O(1). "
            "Explain collision resolution strategies: Chaining (linked lists/trees at buckets) vs Open Addressing (linear/quadratic probing)."
        )
        dsa_q2 = "Explain the difference between a Stack and a Queue with practical software engineering examples."
        dsa_a2 = (
            "Stack is LIFO (Last-In-First-Out), used for function call stacks, undo mechanisms, and parenthesis matching. "
            "Queue is FIFO (First-In-First-Out), used for message queues, BFS graph traversal, and printer task scheduling."
        )
    elif difficulty == "Hard":
        dsa_q1 = "How would you implement an efficient Thread-Safe Concurrent LRU Cache supporting O(1) operations without coarse global locking?"
        dsa_a1 = (
            "Partition the cache into striped segments (Segmented Locks) to reduce lock contention across buckets. "
            "Combine a hash table with a doubly-linked list using Read-Write locks or lock-free concurrent hash maps with atomic pointer updates."
        )
        dsa_q2 = "Given a distributed cluster, how do you implement Consistent Hashing with virtual nodes to handle node additions and evictions with minimal data migration?"
        dsa_a2 = (
            "Map server nodes and data keys onto a circular hash ring [0, 2^32 - 1]. Store multiple virtual node replicas per physical server "
            "to ensure uniform distribution. On node additions, only adjacent ring segments migrate, achieving O(1/N) redistribution."
        )
    else:  # Medium
        dsa_q1 = "How would you design and implement an LRU (Least Recently Used) Cache with O(1) get and put operations?"
        dsa_a1 = (
            "Combine a Hash Map (for O(1) key-to-node lookups) with a Doubly Linked List (for O(1) insertion at head and eviction from tail). "
            "On get/put, move accessed node to head. When capacity is exceeded, evict the tail node and delete its entry from the map."
        )
        dsa_q2 = "Given a continuous stream of numerical data, how do you maintain and retrieve the running median in O(1) time?"
        dsa_a2 = (
            "Maintain two heaps: a Max-Heap for the lower half of values and a Min-Heap for the upper half. "
            "Balance heaps such that size difference is at most 1. Median is the root of the larger heap, or the average of both roots if sizes are equal. "
            "Time complexity: O(log N) insertion, O(1) median query."
        )

    # ML Questions by Difficulty
    if difficulty == "Easy":
        ml_q1 = "What is the difference between Supervised and Unsupervised Learning?"
        ml_a1 = (
            "Supervised learning trains on labeled data (X, y) to predict continuous outcomes (regression) or discrete categories (classification). "
            "Unsupervised learning finds hidden patterns, clustering, or dimensionality reduction in unlabeled data (X)."
        )
        ml_q2 = "What do Precision and Recall measure, and when would you prioritize one over the other?"
        ml_a2 = (
            "Precision is True Positives / (True Positives + False Positives): critical when false alarms are costly (e.g. spam filtering). "
            "Recall is True Positives / (True Positives + False Negatives): critical when missing a positive is catastrophic (e.g. cancer detection, fraud)."
        )
    elif difficulty == "Hard":
        ml_q1 = "How do you mitigate vanishing/exploding gradients in deep networks, and what mathematical role do Residual Connections (Skip Connections) play?"
        ml_a1 = (
            "Skip connections allow identity gradients dF(x)/dx + 1 to backpropagate directly across layers without passing through repetitive shrinking products. "
            "Combine with Layer/Batch Normalization, Xavier/He weight initialization, and gradient clipping."
        )
        ml_q2 = "How do you design an end-to-end MLOps pipeline covering automated model retraining, canary deployment, and real-time concept drift detection?"
        ml_a2 = (
            "Use tools like MLflow for experiment tracking, Evidently/Great Expectations for data drift monitoring (Kolmogorov-Smirnov test), "
            "automated CI/CD pipelines deploying containerized models via Kubernetes, and canary traffic routing with automated rollback triggers on metric degradation."
        )
    else:  # Medium
        ml_q1 = "How do you detect, diagnose, and combat overfitting in machine learning models?"
        ml_a1 = (
            "Detect via diverging training vs validation loss curves. Counter with: 1) L1/L2 Regularization, 2) K-Fold Cross-Validation, "
            "3) Pruning/limiting tree depth in ensembles (Random Forests, XGBoost), 4) Early stopping, and 5) Data augmentation."
        )
        ml_q2 = "Explain the architectural difference between TF-IDF and Sentence Transformers for semantic document matching."
        ml_a2 = (
            "TF-IDF is a sparse lexical word-frequency vectorizer that fails to recognize semantic synonyms ('developer' vs 'engineer'). "
            "Sentence Transformers map text into dense vector space using self-attention, enabling cosine similarity to evaluate conceptual relevance."
        )

    # Behavioral Questions
    if difficulty == "Hard":
        beh_q = "Describe a situation where a critical production outage occurred under your watch. How did you lead the incident response and post-mortem?"
        beh_a = (
            "Use STAR: 1) Immediate containment, 2) Clear communication to stakeholders without blaming individuals, "
            "3) Root cause analysis (5 Whys), 4) Blameless post-mortem document, and 5) Long-term preventative engineering guardrails."
        )
    else:
        beh_q = "Tell me about a time you had a technical disagreement with a team member. How did you resolve it?"
        beh_a = (
            "Frame response around collaboration and data-driven decisions: benchmarked both approaches with synthetic load tests, "
            "compared latency and maintainability metrics objectively, and reached consensus aligned with team goals."
        )

    # HR Questions
    hr_q = f"What draws you toward progressing as a {role}, and where do you envision your technical impact in the next 2-3 years?"
    hr_a = (
        f"Connect your core technical background ({top_skill}, {second_skill}) to solving high-impact domain problems in {role}. "
        "Highlight your commitment to clean architecture, mentorship, and continuous learning."
    )

    questions = [
        {"category": "Technical", "difficulty": difficulty, "question": tech_q1, "answer": tech_a1},
        {"category": "Technical", "difficulty": difficulty, "question": tech_q2, "answer": tech_a2},
        {"category": "Project", "difficulty": difficulty, "question": proj_q1, "answer": proj_a1},
        {"category": "Project", "difficulty": difficulty, "question": proj_q2, "answer": proj_a2},
        {"category": "DSA", "difficulty": difficulty, "question": dsa_q1, "answer": dsa_a1},
        {"category": "DSA", "difficulty": difficulty, "question": dsa_q2, "answer": dsa_a2},
        {"category": "ML", "difficulty": difficulty, "question": ml_q1, "answer": ml_a1},
        {"category": "ML", "difficulty": difficulty, "question": ml_q2, "answer": ml_a2},
        {"category": "Behavioral", "difficulty": difficulty, "question": beh_q, "answer": beh_a},
        {"category": "HR", "difficulty": difficulty, "question": hr_q, "answer": hr_a}
    ]

    return questions

def generate_interview_prep(
    resume_text: str,
    role: str = "Software Engineer",
    difficulty: str = "Medium",
    category: str = "All",
    projects: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Generate questions and answers based on candidate's real profile,
    tailored by difficulty and category filters.
    """
    skills = extract_skills(resume_text)
    curated = generate_curated_interview_questions(
        role=role,
        skills=skills,
        difficulty=difficulty,
        projects=projects
    )

    if category and category != "All":
        filtered = [q for q in curated if q["category"].lower() == category.lower()]
        curated_final = filtered if filtered else curated
    else:
        curated_final = curated

    return {
        "role": role,
        "difficulty": difficulty,
        "category": category,
        "total_questions": len(curated_final),
        "questions": curated_final
    }

# Organigram

In het onderstaande organigram zijn stippelijnen eerder uitzonderlijke overgangen tussen groepen, de volle lijnen zijn de gewoonlijke overgangen.

```mermaid
flowchart TD
    %% kleuren: https://flatuicolors.com/palette/au
    classDef zwemschool fill:#f6e58d,stroke:#f9ca24
    classDef jeugd fill:#ffbe76,stroke:#f0932b
    classDef competitie fill:#ff7979,stroke:#eb4d4b
    classDef volw fill:#badc58,stroke:#6ab04c

    A[Zeepaardjes A/B]
    B[Zee-egels A/B]
    C[Zeehondjes]
    D[Dolfijnen]
    E[Toekomst]
    M[Oriëntatiegroep]
    class A,B,C,D,E,M zwemschool

    A --> B
    B --> C
    C --> D

    M -.-> B
    M -.-> C
    M -.-> D

    F[Sharks]
    G["Speedy's"]
    class F,G jeugd

    D --> F
    F --> G

    I[Sportzwemmers]
    J[Start 2 Swim]
    class I,J volw

    G --> I
    J -.-> I

    K[Précompetitie]
    L[Competitie]
    class K,L competitie

    E --> K
    K --> L

    F --> K
    K -.-> F

    L -.-> G
    G --> L

    L -.-> I

    B -.-> E
    E --> B
    C -.-> E
    E --> C
    D -.-> E
    E --> D
```

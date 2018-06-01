- Each transaction should have:
    - machine ID: the machine that made the mutation
    - user ID: a user ID on who made the mutation

- We should use a Handler to detect mutation and write it out.  The sync method
  should use a promise so that we can update the UI only when the sync has
  completed as it might be to a cloud.

- 

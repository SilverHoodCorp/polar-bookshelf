- Each transaction should have:
    - machine ID: the machine that made the mutation
    - user ID: a user ID on who made the mutation

- We should use a Handler to detect mutation and write it out.  The sync method
  should use a promise so that we can update the UI only when the sync has
  completed as it might be to a cloud.

- the transaction log records should look like:

{
  timestamp: // date the record was written
  user: // the ID of the user
  machine: // the machine that wrote the data
  key:  // the key of the document being mutated
  path: // the path within the document
  op:   // the opcode , SET or DELETE
  value: // the value argument to the opcode
}

# Paths:

Paths use simple dot notation to read the path of a value.

For example the path:

```
.
```

is just the root

```
.author
```

is the path to the author in the root of the document

```
.author.email
```

is the author's email.

To create a structure of:

```json
{
  "author": {
    "email": "me@example.com"
  }

}
```

we could replay a transaction log of:

```json
{ "timestamp": "2018-06-01T17:35:42+00:00", "user": "alice", "machine": "home", "key": "0x0001", "path": ".", "op": "SET", "value": { "author": {"email": "me@example.com"}}}
```

If we wanted to add the author name we would run another transaction

```json
{ "timestamp": "2018-06-01T17:35:42+00:00", "user": "alice", "machine": "home", "key": "0x0001", "path": ".author.name", "op": "SET", "value": "Kevin Burton"}
```

This would change the path and set a value on that path.

We can implement time travel and log reply to rebuild the entire database at any point in time.

# Multiple logs, one per machine.

to support async multi-machine transactions, each machine and user on the machine
has a transaction log.  This way the user can use something like dropbox, sync the
files to the store, then replay the transactions.

If multiple machines are used the individual files don't conflict, they're just
replayed as one stream so the user never needs to perform a file diff comparison
against them or have to deal with version conflicts.

This is also portable to the cloud and the user can just replay each object from
independent transaction logs via a cloud service.

Additionally, we can perform multi-user collaboration with this pattern.  We can
subscribe to transaction logs from multiple users, each merging the mutations on
our end to form the user's viewpoint.



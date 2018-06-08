# Design

# Requirements

- support path structures such as /foo/bar and /

- Support primitive types (numbers, strings, etc) and objects but not arrays.
  Arrays can support append and re-order which isn't what we want to accomplish.

- do not allow dictionaries to be overwritten. If they are then we won't get
  notifications on the new objects.


https://github.com/melanke/Watch.JS/


# Detecting Deletes and Handling the previous values

DELETE is handles just like SET but the value is undefined.

For example. If you have the following object:

```json
{
  "animal": "dog"
}
```

And we execute:

```javascript
delete obj['animal'];
```

We would emit the following event:

```json
{
    "path": "/",
    "mutationType": "DELETE",
    "target": {
    },
    "property": "animal",
    "value": undefined,
    "previousValue": "dog"
}
```

You can look at the mutationType or the value to see if it was deleted via DELETE.

You have the property name and the previous value  if you want to do any type of
cleanup using that value.

FIXME: must handle replaceing the dict with a new dict...

# Edge cases not yet supported

## Replacing dictionary values

If you ahve an object like:

```json
{
   "files": {

   }
}

```

We can register TraceListeners on 'files' but if you REPLACE the value all your
listeners are lost.

For example:

```javascript
obj.files = {};
```

## The default/first event listener won't be re-added on new dictionaries



# Misc Notes

## Options for trace listeners

We might be able to do this with:

- sticky
- path
- recursive

With these three I think we could implement what we need:

- sticky would mean if the property is deleted, it's re-added.

- path would mean apply it to just a specific path (it would default to '*' basically)

- recursive would mean apply it to sub-objects too..

### Use case (disk sync)

This means you could do something like:

```javascript

// init the main tracing datastructure.
myObj = trace(myObj);

myObj.addTraceListener(myTraceListener, {recursive: true, sticky: true });

```

This would basically be our default behavior that I need for sync of the
datastructure to disk including our journal.

### Use case (listen to new pagemarks)

I would call:

```javascript

docMeta.getPageMeta(1).addTraceListener(myTraceListener, {path: "./pagemarks", recursive: true, sticky: true });

```

This would register us at /pageMeta/1.

We might want to add an 'anchorPath' which is where the addListener was
registered at but if the listener know which page it is triggered on that's
actually better.

## Other


I think addListener must be on the PARENT not the child which is kind of an ugly
interface... it must be on the parent because the child could be replaced with a
NEW value and then the listener is on the old object.. not the new one!

 - PLUS.. how would we track if a NEW key appeared when it was empty before???
   We wouldn't be able to do it..

 - so the new API would have to be

   parent.addTraceListener(key, traceListener);



- We HAVE to do the above either way but there's another problem...

    What if we have a shared 'address' object.. do we alert the parents listeners?
    I think we only alert when CHILDREN were changed.. do we do this recursively
    or just a depth of ZERO? I think it's just depth of zero now...

- here is what we have to test
    - shared object at depth 2 changed, the parent is NOT updated.
    -

- addListener only works at ONE level... direct.. if you want to monitor all
  children you have to double trace it... but that's not implemented yet!!! THAT
  is what we need to do because this way the addListener functionality works
  and keeping it non-recursive is actually a nice feature.

- our CURRENT listeners work because I'm listening for keys of maps with
  variable keys....  but what if the key ITSELF is removed and reset?

- add NEW handlers on objects that are replaced when they are objects themselves...

    - what if THEY have recursive event handlers registered? They would not get
      new events!!! we would need some way to re-register them as recursive.

    -

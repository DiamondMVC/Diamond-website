# Tasks

Diamond has support for asynchronous tasks which can be utilized in different ways.

Some of the task functionality are wrappers around vibe.d's task functionality.

However Diamond implements things such as delayed tasks and schedulers that doesn't wrap directly around vibe.d functionality.

## Asynchronous Tasks

Running an asynchronous task in Diamond is simple.

You just import the **diamond.task** package and all the functionality is available.

To run a task and perhaps handle the returned task result you can use **runTask**.

Example:

```
auto task = runTask(
{
  // Do stuff ...
});
```

However if you just want to execute an asynchronous task, but don't care about the result, then you can use **executeTask** which will just execute the given task and discards the result.

Example:

```
executeTask(
{
  // Do stuff ...
});
```

To pause an asynchronous task you just call the **sleep** function.

```
executeTask(
{
  // Do stuff ...

  sleep(2000.msecs); // Pauses the asynchronous task for 2000 milliseconds

  /// Do more stuff ...
});
```

## Delayed Tasks

Sometimes you don't want to execute a task right away, but wait a specific amount of time.

You can use the **delayTask** function to do that.

```
delayTask(25000.msecs,
{
  /// Do stuff after 25000 milliseconds ...  
});
```

Note: The delayed task does not halt execution since it's executed asynchronously.

Also other tasks running on the same thread will continue execution.

## Scheduled Tasks

Scheduled tasks are tasks that are scheduled to run repeatedly, either for a specific amount of times or until their execution has been stopped.

To run scheduled tasks you must create a scheduler, which you add all your scheduled tasks to.

A scheduler is basically a collection of scheduled tasks.

```
auto scheduler = new Scheduler;

// This task is executed every 2500 milliseconds.
auto task = new ScheduledTask(2500.msecs,
{
  // Do stuff ...
});

scheduler.addTask(task);
```

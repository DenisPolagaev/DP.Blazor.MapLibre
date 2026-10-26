#if NET11_0_OR_GREATER
namespace OneOf;

/// <summary>
/// net11 replacement for the <c>OneOf</c> package's marker interface.
/// </summary>
public interface IOneOf
{
    object? Value { get; }
}

/// <summary>
/// net11 replacement for the <c>OneOf</c> package's two-case type. The members mirror the
/// subset used by this library so the same source compiles on both TFMs.
/// </summary>
public union OneOf<T0, T1>(T0, T1) : IOneOf
{
    public static OneOf<T0, T1> FromT0(T0 value) => value;

    public static OneOf<T0, T1> FromT1(T1 value) => value;

    public T0 AsT0 => (T0)Value!;

    public T1 AsT1 => (T1)Value!;

    public bool IsT0 => !IsSecondCase();

    public bool IsT1 => IsSecondCase();

    public void Switch(Action<T0> f0, Action<T1> f1)
    {
        if (IsSecondCase())
        {
            f1((T1)Value!);
            return;
        }

        f0((T0)Value!);
    }

    public TResult Match<TResult>(Func<T0, TResult> f0, Func<T1, TResult> f1) =>
        IsSecondCase() ? f1((T1)Value!) : f0((T0)Value!);

    private bool IsSecondCase()
    {
        if (Value is null)
        {
            return false;
        }

        // The union keeps only the boxed value; when T0 is object the concrete T1 type is
        // the only reliable discriminator (object branches carry scalar literal values).
        return typeof(T0) == typeof(object)
            ? Value is T1
            : Value is not T0;
    }
}
#endif

namespace DP.Blazor.MapLibre.Models.Camera;

/// <summary>
/// Samples a MapLibre easing function into an array of values, so it can be sent to the browser as data.
/// Delegates cannot be serialized, and calling back into .NET for every animation frame would be slow and would
/// not work on Blazor Server, so the curve is sampled once and interpolated on the JavaScript side.
/// </summary>
public static class EasingCurve
{
    /// <summary>Number of intervals used when sampling. 64 keeps the interpolation error well below visible steps.</summary>
    public const int DefaultSampleCount = 64;

    /// <summary>
    /// Evaluates <paramref name="easing"/> at <c>sampleCount + 1</c> evenly spaced points in <c>[0, 1]</c>.
    /// </summary>
    /// <exception cref="ArgumentException">The function returns a value that is not a finite number.</exception>
    public static double[] Sample(Func<double, double> easing, int sampleCount = DefaultSampleCount)
    {
        ArgumentNullException.ThrowIfNull(easing);
        ArgumentOutOfRangeException.ThrowIfLessThan(sampleCount, 2);

        var samples = new double[sampleCount + 1];
        for (var index = 0; index <= sampleCount; index++)
        {
            var value = easing((double)index / sampleCount);
            if (!double.IsFinite(value))
            {
                throw new ArgumentException(
                    $"The easing function returned a non-finite value at t = {(double)index / sampleCount}.",
                    nameof(easing));
            }

            samples[index] = value;
        }

        return samples;
    }
}

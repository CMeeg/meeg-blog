using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace StoryblokDotNet.ContentDelivery;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddStoryblokContentDelivery(
        this IServiceCollection services,
        IConfiguration configuration,
        Action<StoryblokContentDeliveryOptions>? configure = null)
    {
        // Create options from configuration (e.g. appsettings) first

        var options = new StoryblokContentDeliveryOptions();
        configuration.GetSection(StoryblokContentDeliveryOptions.SectionName).Bind(options);

        // Then set options from the configure action

        configure?.Invoke(options);

        return AddStoryblokContentDelivery(services, options);
    }

    public static IServiceCollection AddStoryblokContentDelivery(
        this IServiceCollection services,
        Action<StoryblokContentDeliveryOptions>? configure = null)
    {
        var options = new StoryblokContentDeliveryOptions();
        configure?.Invoke(options);

        return AddStoryblokContentDelivery(services, options);
    }

    public static IServiceCollection AddStoryblokContentDelivery(
        this IServiceCollection services,
        StoryblokContentDeliveryOptions options)
    {
        if (string.IsNullOrEmpty(options.Token))
        {
            throw new InvalidOperationException("The Storyblok Content Delivery API token must be set.");
        }

        services.AddSingleton(Options.Create(options));

        services.AddSingleton<StoryblokContentDeliveryApiClient>();

        services.AddSingleton(
            options.StoryBlockTypeRegistryFactory ?? new Func<IServiceProvider, IStoryBlockTypeRegistry>(sp =>
            {
                ILogger<AssemblyScanningStoryBlockTypeRegistry> logger = sp.GetRequiredService<ILogger<AssemblyScanningStoryBlockTypeRegistry>>();

                return new AssemblyScanningStoryBlockTypeRegistry(AppDomain.CurrentDomain.GetAssemblies(), logger);
            })
        );

        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<StoryblokRequestContext>();

        return services;
    }
}

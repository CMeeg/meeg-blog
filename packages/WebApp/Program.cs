using DotNetEnv.Configuration;
using Microsoft.AspNetCore.ResponseCompression;
using Phoria;
using StoryblokDotNet.ContentDelivery;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add .env file support

builder.Configuration.AddDotNetEnv();

// Add services to the container

string[] supportedCultures = ["en-GB"];

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.AddSupportedCultures(supportedCultures)
        .AddSupportedUICultures(supportedCultures)
        .SetDefaultCulture(supportedCultures[0]);
});

builder.Services.AddStoryblokContentDelivery(options => {
    // TODO: Just use appsettings?
    options.Token = builder.Configuration["STORYBLOK_PREVIEW_TOKEN"] ?? "";
});

if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddResponseCompression(options =>
    {
        options.EnableForHttps = true;
        options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(["image/svg+xml"]);
    });
}

builder.Services.AddRazorPages();

builder.Services.AddPhoria();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");

    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts
    app.UseHsts();

    app.UseResponseCompression();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

if (app.Environment.IsDevelopment())
{
    // WebSockets support is required for Vite HMR (hot module reload)
    app.UseWebSockets();
}

// The order of the Phoria middleware matters so we will place it last
app.UsePhoria();

app.Run();

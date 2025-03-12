using Adliance.Storyblok.Extensions;
using DotNetEnv.Configuration;
using Microsoft.AspNetCore.ResponseCompression;
using Phoria;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add .env file support

builder.Configuration.AddDotNetEnv();

// Add services to the container

if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddResponseCompression(options =>
    {
        options.EnableForHttps = true;
        options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(["image/svg+xml"]);
    });
}

string[] supportedCultures = ["en-GB"];

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.AddSupportedCultures(supportedCultures)
        .AddSupportedUICultures(supportedCultures)
        .SetDefaultCulture(supportedCultures[0]);
});

builder.Services.AddStoryblok(options =>
{
    options.ApiKeyPublic = builder.Configuration["STORYBLOK_PUBLIC_TOKEN"];
    options.ApiKeyPreview = builder.Configuration["STORYBLOK_PREVIEW_TOKEN"];
    options.SupportedCultures = supportedCultures;
});

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

BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'CUSTOMER',
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Tour] (
    [id] INT NOT NULL IDENTITY(1,1),
    [category] NVARCHAR(1000) NOT NULL,
    [basePrice] FLOAT(53) NOT NULL,
    [mainImage] NVARCHAR(1000),
    CONSTRAINT [Tour_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TourTranslation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [tourId] INT NOT NULL,
    [locale] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [description] TEXT NOT NULL,
    [seoTitle] NVARCHAR(1000),
    [seoDescription] NVARCHAR(1000),
    CONSTRAINT [TourTranslation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TourTranslation_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[TourDate] (
    [id] INT NOT NULL IDENTITY(1,1),
    [tourId] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    [capacity] INT NOT NULL,
    [remainingCapacity] INT NOT NULL,
    CONSTRAINT [TourDate_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Booking] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [tourDateId] INT NOT NULL,
    [pax] INT NOT NULL,
    [totalPrice] FLOAT(53) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Booking_status_df] DEFAULT 'PENDING',
    CONSTRAINT [Booking_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[TourTranslation] ADD CONSTRAINT [TourTranslation_tourId_fkey] FOREIGN KEY ([tourId]) REFERENCES [dbo].[Tour]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TourDate] ADD CONSTRAINT [TourDate_tourId_fkey] FOREIGN KEY ([tourId]) REFERENCES [dbo].[Tour]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Booking] ADD CONSTRAINT [Booking_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Booking] ADD CONSTRAINT [Booking_tourDateId_fkey] FOREIGN KEY ([tourDateId]) REFERENCES [dbo].[TourDate]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

import tensorflow as tf
from tensorflow import keras
from keras import Sequential
from tensorflow.keras import layers
from keras.layers import Dense, Conv2D, MaxPooling2D, BatchNormalization
from keras.layers import Dropout, GlobalAveragePooling2D, LeakyReLU
from tensorflow.keras.layers import RandomFlip, RandomRotation, RandomZoom


DATASET_PATH = "Skin_dataset/train"
IMG_SIZE = (224,224)
BATCH_SIZE = 32


train_ds = keras.utils.image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="training",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_ds = keras.utils.image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="validation",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)
# class names
print("\nDetected Classes:")
print(train_ds.class_names)

NUM_CLASSES = len(train_ds.class_names)


# normalisation for scaling it upto 0 - 1
normalization_layer = layers.Rescaling(1./255)

train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))

# Adding autotuning for better performance
AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

# DATA augmentation
data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
])

# LOAD PRETRAINED MODEL
base_model = keras.applications.MobileNetV2(
    input_shape=(224,224,3),
    include_top=False,
    weights="imagenet"
)

 
base_model.trainable = False # freeze the pretained layers

# BUILD MODEL
model = keras.Sequential([
    data_augmentation,
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.4),
    layers.Dense(NUM_CLASSES, activation="softmax")
])

# Compile
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.0001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)
print("\nModel Architecture:")
model.summary()


history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=15
)

model.save("skin_classifier_model.h5")

print("\nModel training complete!")
print("Model saved as skin_classifier_model.h5")



# def process(image,label):
#     image = tf.cast(image/255.0, tf.float32)
#     return image,label

# train_ds = train_ds.map(process)
# test_ds = test_ds.map(process)

# data_augmentation = keras.Sequential([
#     RandomFlip("horizontal"),
#     RandomRotation(0.1),
#     RandomZoom(0.1)
# ])


# train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=tf.data.AUTOTUNE)
# test_ds = test_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)



# model = Sequential()

# model.add(data_augmentation)

# model.add(Conv2D(32,(3,3),padding='same'))
# model.add(BatchNormalization())
# model.add(LeakyReLU())
# model.add(MaxPooling2D(2,2))

# model.add(Conv2D(64,(3,3),padding='same'))
# model.add(BatchNormalization())
# model.add(LeakyReLU())
# model.add(MaxPooling2D(2,2))

# model.add(Conv2D(128,(3,3),padding='same'))
# model.add(BatchNormalization())
# model.add(LeakyReLU())
# model.add(MaxPooling2D(2,2))

# model.add(Conv2D(256,(3,3),padding='same'))
# model.add(BatchNormalization())
# model.add(LeakyReLU())
# model.add(MaxPooling2D(2,2))

# model.add(GlobalAveragePooling2D())

# model.add(Dense(256))
# model.add(LeakyReLU())
# model.add(Dropout(0.5))

# model.add(Dense(3,activation='softmax'))



# model.compile(
#     optimizer=keras.optimizers.Adam(learning_rate=0.0003),
#     loss='sparse_categorical_crossentropy',
#     metrics=['accuracy']
# )



# history = model.fit(
#     train_ds,
#     epochs=12,
#     validation_data=test_ds
# )
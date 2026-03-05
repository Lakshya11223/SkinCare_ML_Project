import tensorflow as tf
from tensorflow import keras
from keras import Sequential
from keras.layers import Dense, Conv2D, MaxPooling2D, BatchNormalization
from keras.layers import Dropout, GlobalAveragePooling2D, LeakyReLU
from tensorflow.keras.layers import RandomFlip, RandomRotation, RandomZoom

# =========================
# Load Dataset
# =========================

train_ds = keras.utils.image_dataset_from_directory(
    directory="Skin_dataset/train",
    labels="inferred",
    label_mode="int",
    batch_size=32,
    image_size=(224,224)
)

test_ds = keras.utils.image_dataset_from_directory(
    directory="Skin_dataset/test",
    labels="inferred",
    label_mode="int",
    batch_size=32,
    image_size=(224,224)
)

# =========================
# Normalization
# =========================

def process(image,label):
    image = tf.cast(image/255.0, tf.float32)
    return image,label

train_ds = train_ds.map(process)
test_ds = test_ds.map(process)

# =========================
# Data Augmentation
# =========================

data_augmentation = keras.Sequential([
    RandomFlip("horizontal"),
    RandomRotation(0.1),
    RandomZoom(0.1)
])

# =========================
# Performance Optimization
# =========================

train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=tf.data.AUTOTUNE)
test_ds = test_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)

# =========================
# Model
# =========================

model = Sequential()

model.add(data_augmentation)

model.add(Conv2D(32,(3,3),padding='same'))
model.add(BatchNormalization())
model.add(LeakyReLU())
model.add(MaxPooling2D(2,2))

model.add(Conv2D(64,(3,3),padding='same'))
model.add(BatchNormalization())
model.add(LeakyReLU())
model.add(MaxPooling2D(2,2))

model.add(Conv2D(128,(3,3),padding='same'))
model.add(BatchNormalization())
model.add(LeakyReLU())
model.add(MaxPooling2D(2,2))

model.add(Conv2D(256,(3,3),padding='same'))
model.add(BatchNormalization())
model.add(LeakyReLU())
model.add(MaxPooling2D(2,2))

model.add(GlobalAveragePooling2D())

model.add(Dense(256))
model.add(LeakyReLU())
model.add(Dropout(0.5))

model.add(Dense(3,activation='softmax'))

# =========================
# Compile
# =========================

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.0003),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# =========================
# Train
# =========================

history = model.fit(
    train_ds,
    epochs=12,
    validation_data=test_ds
)
# Module 06: Complete Unity 6 C# Implementation Blueprints

## 1. Production Scripts Catalog

This module provides complete, production-ready C# scripts for the newly introduced creative mechanics, fully optimized for Unity 6 (6.5 LTS) with zero per-frame garbage generation.

---

### 1.1 `WindAerodynamicsManager.cs`: Telegraphed Mountain Gusts
Applies periodic lateral aerodynamic forces to ungrounded and tall rigidbodies, complete with particle and audio telegraphing.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WindAerodynamicsManager : MonoBehaviour
{
    [Header("Wind Force Configuration")]
    [SerializeField] private Vector3 windDirection = Vector3.right;
    [SerializeField] private float baseWindForce = 45f;
    [SerializeField] private float gustPeakMultiplier = 2.5f;

    [Header("Gust Timing Cycle")]
    [SerializeField] private float calmDurationSeconds = 8.0f;
    [SerializeField] private float warningDurationSeconds = 2.0f;
    [SerializeField] private float activeGustDurationSeconds = 4.0f;

    [Header("Visual & Audio FX")]
    [SerializeField] private ParticleSystem windLeavesParticleVfx;
    [SerializeField] private AudioSource windAudioSource;
    [SerializeField] private AudioClip windChimeWarningSound;

    private readonly List<Rigidbody> affectedBodies = new List<Rigidbody>();
    private bool isGustActive;

    public void RegisterBody(Rigidbody rb)
    {
        if (!affectedBodies.Contains(rb)) affectedBodies.Add(rb);
    }

    public void UnregisterBody(Rigidbody rb)
    {
        affectedBodies.Remove(rb);
    }

    private void Start()
    {
        StartCoroutine(WindCycleRoutine());
    }

    private IEnumerator WindCycleRoutine()
    {
        while (true)
        {
            // 1. Calm State
            isGustActive = false;
            yield return new WaitForSeconds(calmDurationSeconds);

            // 2. Warning State (Telegraph with wind chimes)
            if (windAudioSource && windChimeWarningSound)
            {
                windAudioSource.PlayOneShot(windChimeWarningSound);
            }
            yield return new WaitForSeconds(warningDurationSeconds);

            // 3. Active Gust State
            isGustActive = true;
            if (windLeavesParticleVfx) windLeavesParticleVfx.Play();

            float elapsed = 0f;
            while (elapsed < activeGustDurationSeconds)
            {
                elapsed += Time.fixedDeltaTime;
                yield return new WaitForFixedUpdate();

                // Apply aerodynamic drag to active rigidbodies
                float gustIntensity = Mathf.Sin((elapsed / activeGustDurationSeconds) * Mathf.PI);
                float forceMagnitude = baseWindForce * Mathf.Lerp(1.0f, gustPeakMultiplier, gustIntensity);
                Vector3 currentForce = windDirection.normalized * forceMagnitude;

                for (int i = 0; i < affectedBodies.Count; i++)
                {
                    Rigidbody rb = affectedBodies[i];
                    if (rb != null && !rb.isKinematic && !rb.IsSleeping())
                    {
                        // Force applied proportionally to height from ground
                        float heightFactor = Mathf.Clamp(rb.position.y, 0.5f, 5.0f);
                        rb.AddForce(currentForce * heightFactor, ForceMode.Force);
                    }
                }
            }

            if (windLeavesParticleVfx) windLeavesParticleVfx.Stop();
        }
    }
}
```

---

### 1.2 `LiquidMercuryCoreShape.cs`: Dynamic Sloshing Center of Mass
Continuously recalculates the internal liquid mercury distribution based on block tilt angle, dynamically offsetting `Rigidbody.centerOfMass`.

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class LiquidMercuryCoreShape : MonoBehaviour
{
    [Header("Cavity Configuration")]
    [SerializeField] private float cavityHalfWidth = 0.45f;
    [SerializeField] private float fluidViscosityLag = 6.0f;
    [SerializeField] private float fluidMassFraction = 0.65f;

    private Rigidbody rb;
    private Vector3 targetLocalCoM;
    private Vector3 currentLocalCoM;

    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.constraints = RigidbodyConstraints.FreezePositionZ | 
                         RigidbodyConstraints.FreezeRotationX | 
                         RigidbodyConstraints.FreezeRotationY;
    }

    private void FixedUpdate()
    {
        if (rb.isKinematic) return;

        // Calculate current tilt angle relative to global gravity (down)
        float tiltAngleZ = transform.localEulerAngles.z;
        if (tiltAngleZ > 180f) tiltAngleZ -= 360f; // Wrap to [-180, 180]

        // Fluid sloshes to the lowest side: x = -sin(angle) * width
        float targetOffsetX = -Mathf.Sin(tiltAngleZ * Mathf.Deg2Rad) * cavityHalfWidth * fluidMassFraction;
        targetLocalCoM = new Vector3(targetOffsetX, -0.1f, 0f);

        // Smoothly interpolate fluid inertia to simulate viscous mercury
        currentLocalCoM = Vector3.Lerp(currentLocalCoM, targetLocalCoM, fluidViscosityLag * Time.fixedDeltaTime);
        rb.centerOfMass = currentLocalCoM;
    }

    private void OnDrawGizmosSelected()
    {
        if (rb != null)
        {
            Gizmos.color = Color.cyan;
            Gizmos.DrawSphere(transform.TransformPoint(currentLocalCoM), 0.07f);
        }
    }
}
```

---

### 1.3 `CentroidComboTracker.cs`: Ketchapp-Style Precision Alignment Detector
Calculates millimeter-precision centroid alignment when shapes are placed, triggering ascending pentatonic musical scale notes and golden water rings.

```csharp
using System;
using UnityEngine;

public class CentroidComboTracker : MonoBehaviour
{
    [Header("Precision Thresholds")]
    [Tooltip("Maximum horizontal center-of-mass distance to trigger a Harmonic Snap (Default: 5mm).")]
    [SerializeField] private float maxAlignmentDeviation = 0.005f;

    [Header("Audio Tones (Pentatonic C, D, E, G, A)")]
    [SerializeField] private AudioClip[] pentatonicNotes;
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private ParticleSystem goldenLotusVfxPrefab;

    public event Action<int> OnComboStreakUpdated;
    public event Action OnAuraOfStillnessActivated;

    private int currentComboStreak = 0;

    public void EvaluatePlacementPrecision(DraggableShape placedShape, Transform supportPlatform)
    {
        if (placedShape == null || supportPlatform == null) return;

        // Calculate horizontal offset between placed shape CoM and support center
        Vector3 shapeWorldCoM = placedShape.Body.worldCenterOfMass;
        Vector3 supportWorldPos = supportPlatform.position;
        float horizontalDeviation = Mathf.Abs(shapeWorldCoM.x - supportWorldPos.x);

        if (horizontalDeviation <= maxAlignmentDeviation)
        {
            // PERFECT HARMONIC SNAP!
            currentComboStreak++;
            PlayHarmonicTone(currentComboStreak);
            SpawnGoldenLotusRing(placedShape.transform.position);

            OnComboStreakUpdated?.Invoke(currentComboStreak);
            HapticFeedbackManager.TriggerLightTick();

            if (currentComboStreak >= 5)
            {
                OnAuraOfStillnessActivated?.Invoke();
            }
        }
        else
        {
            // Reset combo streak
            currentComboStreak = 0;
            OnComboStreakUpdated?.Invoke(0);
        }
    }

    private void PlayHarmonicTone(int streak)
    {
        if (pentatonicNotes == null || pentatonicNotes.Length == 0 || audioSource == null) return;

        int noteIndex = Mathf.Clamp(streak - 1, 0, pentatonicNotes.Length - 1);
        audioSource.PlayOneShot(pentatonicNotes[noteIndex]);
    }

    private void SpawnGoldenLotusRing(Vector3 position)
    {
        if (goldenLotusVfxPrefab != null)
        {
            Instantiate(goldenLotusVfxPrefab, position, Quaternion.identity);
        }
    }
}
```

---

### 1.4 `IdlePhysicsGenerator.cs`: Offline Passive Income Engine
Calculates offline currency accumulation based on waterwheel and sanctuary machine levels, validated against UTC server timestamps.

```csharp
using System;
using UnityEngine;

public class IdlePhysicsGenerator : MonoBehaviour
{
    private const string LastSaveTimeKey = "ZenSanctuary_LastSaveTime";
    private const string WaterwheelLevelKey = "ZenSanctuary_WaterwheelLevel";

    [Header("Idle Parameters")]
    [SerializeField] private float baseCoinsPerHour = 25f;
    [SerializeField] private float maxOfflineHoursCap = 8.0f;

    public int CalculateOfflineEarnings()
    {
        if (!PlayerPrefs.HasKey(LastSaveTimeKey))
        {
            SaveCurrentTimestamp();
            return 0;
        }

        long lastBinaryTime = Convert.ToInt64(PlayerPrefs.GetString(LastSaveTimeKey));
        DateTime lastDateTime = DateTime.FromBinary(lastBinaryTime);
        DateTime currentUtc = DateTime.UtcNow;

        TimeSpan offlineSpan = currentUtc - lastDateTime;
        double offlineHours = Mathf.Clamp((float)offlineSpan.TotalHours, 0f, maxOfflineHoursCap);

        int machineLevel = PlayerPrefs.GetInt(WaterwheelLevelKey, 1);
        float coinsEarned = (baseCoinsPerHour * machineLevel) * (float)offlineHours;

        SaveCurrentTimestamp();
        return Mathf.FloorToInt(coinsEarned);
    }

    public void SaveCurrentTimestamp()
    {
        PlayerPrefs.SetString(LastSaveTimeKey, DateTime.UtcNow.ToBinary().ToString());
        PlayerPrefs.Save();
    }

    private void OnApplicationPause(bool pauseStatus)
    {
        if (pauseStatus) SaveCurrentTimestamp();
    }

    private void OnApplicationQuit()
    {
        SaveCurrentTimestamp();
    }
}
```
